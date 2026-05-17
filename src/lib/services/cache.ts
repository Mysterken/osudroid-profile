type Entry<T> = {
	value: T;
	expiresAt: number;
};

const store = new Map<string, Entry<unknown>>();
const pending = new Map<string, Promise<unknown>>();

let MAX_ENTRIES = 1000; // default maximum cache size
let SWEEP_INTERVAL_MS = 60_000; // default periodic sweep every 60s
let opsSinceLastSweep = 0;
const SWEEP_AFTER_OPS = 500; // opportunistic sweep after this many get/set ops

let sweepTimer: NodeJS.Timeout | null = null;

/**
 * Configure the cache runtime behavior. Call early in app startup if you want custom values.
 */
export function configureCache(opts: { maxEntries?: number; sweepIntervalMs?: number } = {}) {
	if (typeof opts.maxEntries === 'number' && opts.maxEntries > 0) {
		MAX_ENTRIES = Math.max(1, Math.floor(opts.maxEntries));
	}
	if (typeof opts.sweepIntervalMs === 'number' && opts.sweepIntervalMs >= 1000) {
		SWEEP_INTERVAL_MS = opts.sweepIntervalMs;
	}

	// restart sweep timer with new interval
	if (sweepTimer) {
		clearInterval(sweepTimer);
		sweepTimer = null;
	}
	if (SWEEP_INTERVAL_MS > 0) {
		if (typeof setInterval === 'function') {
			sweepTimer = setInterval(() => {
				try {
					sweepExpired();
				} catch (e) {
					console.error('cache sweep error', e);
				}
			}, SWEEP_INTERVAL_MS);
			// Do not keep Node process alive just because of this timer.
			if (sweepTimer.unref) sweepTimer.unref();
		}
	}
}

/**
 * Evict the least-recently-used entry (oldest insertion order in Map)
 */
function evictIfNeeded() {
	while (store.size > MAX_ENTRIES) {
		const oldestKey = store.keys().next().value;
		if (!oldestKey) break;
		store.delete(oldestKey);
	}
}

/**
 * Remove expired entries from the store
 */
export function sweepExpired(maxToSweep = Infinity) {
	if (store.size === 0) return;
	const now = Date.now();
	let swept = 0;
	// iterate in insertion order; safe to delete while iterating
	for (const [key, entry] of store) {
		if (entry.expiresAt <= now) {
			store.delete(key);
			swept++;
			if (swept >= maxToSweep) break;
		}
	}
}

/**
 * Set a cache entry. This also performs opportunistic sweeps and evictions.
 */
export function setCache<T>(key: string, value: T, ttlMs: number) {
	const expiresAt = Date.now() + Math.max(0, ttlMs);
	// If key exists, delete then re-set to move it to the newest position
	if (store.has(key)) store.delete(key);
	store.set(key, { value, expiresAt });

	// opportunistic housekeeping
	opsSinceLastSweep++;
	if (opsSinceLastSweep >= SWEEP_AFTER_OPS) {
		opsSinceLastSweep = 0;
		sweepExpired(1000); // sweep up to 1000 expired entries
	}

	evictIfNeeded();
}

/**
 * Get a cache entry. If present and not expired, return it and move it to newest position.
 */
export function getCache<T>(key: string): T | undefined {
	const e = store.get(key);
	if (!e) return undefined;

	if (Date.now() >= e.expiresAt) {
		store.delete(key);
		return undefined;
	}

	// Move to newest (LRU)
	store.delete(key);
	store.set(key, e);

	// opportunistic housekeeping
	opsSinceLastSweep++;
	if (opsSinceLastSweep >= SWEEP_AFTER_OPS) {
		opsSinceLastSweep = 0;
		sweepExpired(1000);
	}

	return e.value as T;
}

export function delCache(key: string) {
	store.delete(key);
}

export function clearCache() {
	store.clear();
}

/**
 * Wrap an async data fetch with cache + de-duplication.
 *
 * Behavior:
 * - If cached valid value exists, return it.
 * - If a fetch is already in-flight for the same key, wait for it.
 * - Otherwise call fetcher(), cache its successful result, and return it.
 * - If fetcher throws, do not cache the error.
 */
export async function wrapCache<T>(
	key: string,
	ttlMs: number,
	fetcher: () => Promise<T>
): Promise<T> {
	const cached = getCache<T>(key);
	if (cached !== undefined) return cached;

	if (pending.has(key)) {
		return pending.get(key)! as Promise<T>;
	}

	const p = (async () => {
		try {
			const result = await fetcher();
			setCache<T>(key, result, ttlMs);
			return result;
		} finally {
			pending.delete(key);
		}
	})();

	pending.set(key, p);
	return p;
}

// Initialize timer with default settings when this module is loaded
// Call configureCache() from app bootstrap if you want to override defaults.
try {
	configureCache();
} catch {
	// ignore failures during SSR/build
}

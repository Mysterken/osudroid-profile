type Entry<T> = {
	value: T;
	expiresAt: number;
};

const store = new Map<string, Entry<unknown>>();
const pending = new Map<string, Promise<unknown>>();

export function setCache<T>(key: string, value: T, ttlMs: number) {
	store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function getCache<T>(key: string): T | undefined {
	const e = store.get(key);
	if (!e) return undefined;
	if (Date.now() >= e.expiresAt) {
		store.delete(key);
		return undefined;
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

export type FetchCacheOptions = {
	ttlMs?: number;
	cacheKey?: string; // optional override
	force?: boolean; // bypass cache
};

function buildKey(url: string, init?: RequestInit) {
	return `fetchcache:${url}:${init ? JSON.stringify({ method: init.method, headers: init.headers }) : ''}`;
}

/**
 * Fetch JSON with localStorage cache. Returns parsed JSON.
 */
export async function fetchWithLocalCache(
	url: string,
	init?: RequestInit,
	opts: FetchCacheOptions = {}
) {
	if (typeof window === 'undefined') {
		const res = await fetch(url, init);
		if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
		return res.json();
	}

	const ttlMs = opts.ttlMs ?? 30 * 1000;
	const key = opts.cacheKey ?? buildKey(url, init);

	if (!opts.force) {
		try {
			const raw = localStorage.getItem(key);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed && parsed.expiresAt && Date.now() < parsed.expiresAt) {
					return parsed.data;
				} else {
					localStorage.removeItem(key);
				}
			}
		} catch (e) {
			console.error('Failed to parse fetch response from localStorage:', e);
		}
	}

	const res = await fetch(url, init);
	if (!res.ok) {
		throw new Error(`Fetch failed: ${res.status}`);
	}
	const data = await res.json();

	try {
		localStorage.setItem(
			key,
			JSON.stringify({
				expiresAt: Date.now() + ttlMs,
				data
			})
		);
	} catch (e) {
		console.error('Failed to store fetch response in localStorage:', e);
	}

	return data;
}

/**
 * Optional helper to clear a cached key
 */
export function clearLocalFetchCache(url: string, init?: RequestInit) {
	if (typeof window === 'undefined') return;
	const key = buildKey(url, init);
	localStorage.removeItem(key);
}

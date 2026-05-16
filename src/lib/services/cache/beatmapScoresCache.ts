import type { BeatmapScore } from '$lib/models/beatmapScore';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
	data: BeatmapScore[];
	expires: number;
}

const cache = new Map<string, CacheEntry>();

export function getCacheKey(hash: string, order: string, page: number): string {
	return `${hash}:${order}:${page}`;
}

export function getScoresCache(key: string): BeatmapScore[] | null {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() > entry.expires) {
		cache.delete(key);
		return null;
	}
	return entry.data;
}

export function setScoresCache(key: string, data: BeatmapScore[]): void {
	cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
}

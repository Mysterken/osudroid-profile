import { getBeatmaps, lookupBeatmap, refreshTokenIfNeeded } from '$lib/services/osuApi';
import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';
import { ApiError, MissingError, NotFoundError } from '$lib/services/errors/osuApiError';
import { loadHashCache, saveHashCache } from '$lib/services/cache/hashToId';
import logger from '$lib/utils/logger';

const CACHE_TTL = 24 * 60 * 60 * 1000;
const beatmapCache = new Map<string, { data: BeatmapExtended | null; expires: number }>();

export async function batchFetchBeatmaps(lookups: { filename: string; hash?: string }[]) {
	const hashToIdCache = await loadHashCache();

	const newHashes = new Set<string>();
	const finalResults: { key: string; beatmap: BeatmapExtended | null; error?: string }[] = [];
	const pendingLookups: { key: string; id: number }[] = [];

	await refreshTokenIfNeeded();

	for (const { filename, hash } of lookups) {
		const key = hash || filename;
		const cached = beatmapCache.get(key);

		if (cached && cached.expires > Date.now()) {
			finalResults.push({ key, beatmap: cached.data });
			continue;
		}

		if (hash && hashToIdCache.has(hash)) {
			pendingLookups.push({ key, id: hashToIdCache.get(hash)! });
		} else {
			try {
				const beatmap = await lookupBeatmap(filename, hash);
				beatmapCache.set(key, { data: beatmap, expires: Date.now() + CACHE_TTL });
				if (hash) {
					hashToIdCache.set(hash, beatmap.id);
					newHashes.add(hash);
				}
				finalResults.push({ key, beatmap });
			} catch (err) {
				handleError(err, key, finalResults);
			}
		}
	}

	if (newHashes.size > 0) {
		await saveHashCache(hashToIdCache);
	}

	if (pendingLookups.length) {
		try {
			const beatmaps = await getBeatmaps(pendingLookups.map((p) => p.id));
			for (const { key, id } of pendingLookups) {
				const beatmap = beatmaps.find((b) => b.id === id) ?? null;
				beatmapCache.set(key, { data: beatmap, expires: Date.now() + CACHE_TTL });
				finalResults.push({ key, beatmap });
			}
		} catch (err) {
			handleBulkError(err, pendingLookups, finalResults);
		}
	}

	return finalResults;
}

function handleError(
	err: unknown,
	key: string,
	finalResults: {
		key: string;
		beatmap: BeatmapExtended | null;
		error?: string;
	}[]
) {
	if (err instanceof NotFoundError) {
		beatmapCache.set(key, { data: null, expires: Date.now() + CACHE_TTL });
		finalResults.push({ key, beatmap: null });
	} else if (err instanceof MissingError) {
		finalResults.push({ key, beatmap: null, error: err.message });
	} else if (err instanceof ApiError) {
		finalResults.push({ key, beatmap: null, error: 'osu! API Error' });
	} else {
		logger.error({ err }, `❌ Unexpected error fetching beatmap for key: ${key}`);
		finalResults.push({ key, beatmap: null, error: 'Internal server error' });
	}
}

function handleBulkError(
	err: unknown,
	pendingLookups: { key: string; id: number }[],
	finalResults: {
		key: string;
		beatmap: BeatmapExtended | null;
		error?: string;
	}[]
) {
	logger.error({ err }, '❌ Unexpected error during bulk beatmap fetch');
	for (const { key } of pendingLookups) {
		finalResults.push({ key, beatmap: null, error: 'Bulk lookup failed' });
	}
}

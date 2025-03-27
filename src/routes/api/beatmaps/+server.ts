import { lookupBeatmap } from '$lib/services/osuApi';
import { json, type RequestHandler } from '@sveltejs/kit';
import { ApiError, MissingError, NotFoundError } from '$lib/services/errors/osuApiError';
import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hour cache
const beatmapCache = new Map<string, { data: BeatmapExtended | null; expires: number }>();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { lookups } = (await request.json()) as {
			lookups: { filename: string; hash?: string }[];
		};

		if (!Array.isArray(lookups)) {
			return json({ error: 'lookups must be an array' }, { status: 400 });
		}

		const results = await Promise.all(
			lookups.map(async ({ filename, hash }) => {
				const cacheKey = hash || filename;
				try {
					const cached = beatmapCache.get(cacheKey);

					if (cached && cached.expires > Date.now()) {
						return { key: cacheKey, beatmap: cached.data };
					}

					const beatmap = await lookupBeatmap(filename, hash);
					beatmapCache.set(cacheKey, { data: beatmap, expires: Date.now() + CACHE_TTL });

					return { key: cacheKey, beatmap };
				} catch (err) {
					if (err instanceof NotFoundError) {
						beatmapCache.set(cacheKey, { data: null, expires: Date.now() + CACHE_TTL });
						return { key: cacheKey, beatmap: null };
					}

					if (err instanceof MissingError) return { key: cacheKey, error: err.message };
					if (err instanceof ApiError) return { key: cacheKey, error: 'osu! API Error' };

					console.error(`❌ Error fetching ${cacheKey}:`, err);
					return { key: cacheKey, error: 'Internal server error' };
				}
			})
		);

		return json(results);
	} catch (err) {
		console.error('❌ Failed to process batch beatmap request:', err);
		return json({ error: 'Invalid request body' }, { status: 400 });
	}
};

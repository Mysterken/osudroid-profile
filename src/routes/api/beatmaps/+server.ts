import { lookupBeatmap } from '$lib/services/osuApi';
import { json, type RequestHandler } from '@sveltejs/kit';
import { ApiError, NotFoundError } from '$lib/services/errors/osuApiError';
import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hour cache
const beatmapCache = new Map<string, { data: BeatmapExtended | null; expires: number }>();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { filenames } = (await request.json()) as { filenames: string[] };

		if (!Array.isArray(filenames)) {
			return json({ error: 'filenames must be an array' }, { status: 400 });
		}

		const results = await Promise.all(
			filenames.map(async (filename) => {
				try {
					// Check cache first
					const cached = beatmapCache.get(filename);

					if (cached && cached.expires > Date.now()) {
						return { filename, beatmap: cached.data };
					}

					const beatmap = await lookupBeatmap(filename);
					beatmapCache.set(filename, { data: beatmap, expires: Date.now() + CACHE_TTL });
					return { filename, beatmap };
				} catch (err) {
					if (err instanceof NotFoundError) {
						beatmapCache.set(filename, { data: null, expires: Date.now() + CACHE_TTL });
						return { filename, beatmap: null };
					}

					if (err instanceof ApiError) {
						return { filename, error: 'osu! API Error' };
					}

					console.error(`❌ Unexpected error fetching ${filename}:`, err);
					return { filename, error: 'Internal server error' };
				}
			})
		);

		return json(results);
	} catch (err) {
		console.error('❌ Failed to process batch beatmap request:', err);
		return json({ error: 'Invalid request body' }, { status: 400 });
	}
};

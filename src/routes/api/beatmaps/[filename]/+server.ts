import type { RequestHandler } from './$types';
import { lookupBeatmap } from '$lib/services/osuApi';
import { json } from '@sveltejs/kit';
import { ApiError, NotFoundError } from '$lib/services/errors/osuApiError';
import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';

const CACHE_TTL = 60 * 60 * 1000; // ⏳ 1 hour cache duration
const beatmapCache = new Map<string, { data: BeatmapExtended | null; expires: number }>();

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { filename } = params;

		const cachedData = beatmapCache.get(filename);
		if (cachedData && cachedData.expires > Date.now()) {
			const data = cachedData.data;
			return json(data ? data : { error: 'Beatmap not found' }, { status: data ? 200 : 404 });
		}

		const beatmap = await lookupBeatmap(filename);

		// Store response in cache
		beatmapCache.set(filename, { data: beatmap, expires: Date.now() + CACHE_TTL });

		return json(beatmap);
	} catch (error) {
		if (error instanceof NotFoundError) {
			beatmapCache.set(params.filename, { data: null, expires: Date.now() + CACHE_TTL });
			return json({ error: error.message }, { status: 404 });
		}

		if (error instanceof ApiError) {
			return json({ error: 'osu! API Error' }, { status: 502 });
		}

		console.error(`❌ Unexpected error in beatmap route:`, error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { fetchBeatmapScoresFromApi } from '$lib/services/osudroidApi';
import { NotFoundError, ApiError } from '$lib/services/errors/userErrors';
import { wrapCache } from '$lib/services/cache';
import logger from '$lib/utils/logger';

export const GET: RequestHandler = async ({ params, url }) => {
	const hash = params.hash;
	const order = (url.searchParams.get('order') ?? 'score') as 'sid' | 'date' | 'score' | 'pp';
	const page = parseInt(url.searchParams.get('page') ?? '0', 10);

	if (!hash || hash.length !== 32) {
		return json(
			{ error: 'Invalid beatmap hash. Must be a 32-character MD5 string.' },
			{ status: 400 }
		);
	}

	try {
		const cacheKey = `beatmapScores:${hash}:${order}:${page}`;

		const scores = await wrapCache(cacheKey, 5 * 60 * 1000, async () => {
			logger.info(`🎵 Fetching scores for beatmap hash: ${hash}, order=${order}, page=${page}`);
			return await fetchBeatmapScoresFromApi(hash, order, page);
		});

		return json(scores);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return json([], { status: 200 });
		}
		if (error instanceof ApiError) {
			logger.error({ error }, '❌ osu!droid API error fetching beatmap scores');
			return json({ error: 'Failed to fetch beatmap scores' }, { status: 502 });
		}
		logger.error({ error }, '❌ Unexpected error fetching beatmap scores');
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

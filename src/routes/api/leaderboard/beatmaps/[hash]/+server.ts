import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { fetchBeatmapScoresFromApi } from '$lib/services/osudroidApi';
import { NotFoundError, ApiError } from '$lib/services/errors/userErrors';
import {
	getCacheKey,
	getScoresCache,
	setScoresCache
} from '$lib/services/cache/beatmapScoresCache';
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

	const cacheKey = getCacheKey(hash, order, page);
	const cached = getScoresCache(cacheKey);

	if (cached) {
		logger.debug(`🎯 Cache hit for beatmap scores: ${cacheKey}`);
		return json(cached);
	}

	try {
		logger.info(`🎵 Fetching scores for beatmap hash: ${hash}, order=${order}, page=${page}`);
		const scores = await fetchBeatmapScoresFromApi(hash, order, page);
		setScoresCache(cacheKey, scores);
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

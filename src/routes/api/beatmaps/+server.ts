import { json, type RequestHandler } from '@sveltejs/kit';
import { batchFetchBeatmaps } from '$lib/services/beatmaps/fetchBeatmaps';
import logger from '$lib/utils/logger';

export const POST: RequestHandler = async ({ request }) => {
	try {
		logger.info('📦 Processing batch beatmap request');
		const { lookups } = await request.json();
		if (!Array.isArray(lookups)) {
			return json({ error: 'lookups must be an array' }, { status: 400 });
		}

		const results = await batchFetchBeatmaps(lookups);

		return json(results);
	} catch (err) {
		logger.error({ err }, '❌ Failed to process batch beatmap request');
		return json({ error: 'Invalid request body' }, { status: 400 });
	}
};

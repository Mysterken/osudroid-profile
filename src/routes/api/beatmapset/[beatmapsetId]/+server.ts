import { json, type RequestHandler } from '@sveltejs/kit';
import { getBeatmapset, refreshTokenIfNeeded } from '$lib/services/osuApi';
import logger from '$lib/utils/logger';
import { NotFoundError } from '$lib/services/errors/userErrors';

export const GET: RequestHandler = async ({ params }) => {
	const beatmapsetId = parseInt(params.beatmapsetId ?? '', 10);

	if (isNaN(beatmapsetId)) {
		return json({ error: 'Invalid beatmapset ID' }, { status: 400 });
	}

	try {
		await refreshTokenIfNeeded();
		logger.info(`🎵 Fetching beatmapset by ID: ${beatmapsetId}`);
		const beatmapset = await getBeatmapset(beatmapsetId);

		if (!beatmapset) {
			return json({ error: 'Beatmapset not found' }, { status: 404 });
		}

		return json(beatmapset);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return json({ error: error.message }, { status: 404 });
		}

		logger.error({ error }, '❌ Failed to fetch beatmapset by ID');
		return json({ error: 'Failed to fetch beatmapset' }, { status: 500 });
	}
};

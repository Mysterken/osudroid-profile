import { json, type RequestHandler } from '@sveltejs/kit';
import { getBeatmaps, refreshTokenIfNeeded } from '$lib/services/osuApi';
import logger from '$lib/utils/logger';

export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id ?? '', 10);

	if (isNaN(id)) {
		return json({ error: 'Invalid beatmap ID' }, { status: 400 });
	}

	try {
		await refreshTokenIfNeeded();
		logger.info(`🎵 Fetching beatmap by ID: ${id}`);
		const beatmaps = await getBeatmaps([id]);

		if (!beatmaps || beatmaps.length === 0) {
			return json({ error: 'Beatmap not found' }, { status: 404 });
		}

		return json(beatmaps[0]);
	} catch (error) {
		logger.error({ error }, '❌ Failed to fetch beatmap by ID');
		return json({ error: 'Failed to fetch beatmap' }, { status: 500 });
	}
};

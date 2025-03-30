import { json, type RequestHandler } from '@sveltejs/kit';
import { batchFetchBeatmaps } from '$lib/services/beatmaps/fetchBeatmaps';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { lookups } = await request.json();
		if (!Array.isArray(lookups)) {
			return json({ error: 'lookups must be an array' }, { status: 400 });
		}

		const results = await batchFetchBeatmaps(lookups);
		return json(results);
	} catch (err) {
		console.error('❌ Failed to process batch beatmap request:', err);
		return json({ error: 'Invalid request body' }, { status: 400 });
	}
};

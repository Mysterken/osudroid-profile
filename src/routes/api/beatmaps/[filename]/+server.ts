import type { RequestHandler } from './$types';
import { lookupBeatmap } from '$lib/services/osuApi';
import { json } from '@sveltejs/kit';
import { ApiError, NotFoundError } from '$lib/services/errors/osuApiError';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const beatmap = await lookupBeatmap(params.filename);
		return json(beatmap);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return json({ error: error.message }, { status: 404 });
		}

		if (error instanceof ApiError) {
			return json({ error: 'osu! API Error' }, { status: 502 });
		}

		// ❌ Fallback for unknown errors
		console.error(`❌ Unexpected error in beatmap route:`, error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

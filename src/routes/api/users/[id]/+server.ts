import type { RequestHandler } from './$types';
import { getUserProfile } from '$lib/services/userService';
import { json } from '@sveltejs/kit';
import { ApiError, NotFoundError, ScraperError } from '$lib/services/errors/userErrors';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const user = await getUserProfile(params.id);

		return json(user);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return json({ error: error.message }, { status: 404 });
		}

		if (error instanceof ApiError || error instanceof ScraperError) {
			return json({ error: 'External data source failed' }, { status: 502 });
		}

		console.error(`❌ Unexpected error in user route:`, error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

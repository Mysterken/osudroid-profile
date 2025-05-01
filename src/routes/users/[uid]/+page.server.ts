import type { PageServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import { isCrawler } from '$lib/crawler/isCrawler';
import { getUserProfile } from '$lib/services/userService';
import { error } from '@sveltejs/kit';
import { ApiError, NotFoundError, ScraperError } from '$lib/services/errors/userErrors';

export const load: PageServerLoad = async ({ params }) => {
	const { request } = getRequestEvent();

	// fetch user data directly from the API if the request is from a crawler
	if (isCrawler(request)) {
		try {
			const user = await getUserProfile(params.uid);

			return { user };
		} catch (err) {
			if (err instanceof NotFoundError) {
				return { user: null };
			}

			if (err instanceof ApiError || err instanceof ScraperError) {
				error(502, 'External data source failed');
			}

			console.error(`❌ Unexpected error in user route:`, err);
			error(500, 'Internal server error');
		}
	}

	return { user: null };
};

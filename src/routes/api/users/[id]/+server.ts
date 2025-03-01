import type { RequestHandler } from './$types';
import { getUserProfile } from '$lib/services/userService';
import { json } from '@sveltejs/kit';
import type { ApiPlayer, ScraperPlayer } from '$lib/models/player';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const user: ApiPlayer | ScraperPlayer = await getUserProfile(params.id);

		return json(user);
	} catch (error) {

		if (error instanceof Error) {
			if (error.message === 'User not found') {
				return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
			}
		}

		console.error('Error getting user profile', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
};

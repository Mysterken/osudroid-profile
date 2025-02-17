import type { RequestHandler } from './$types';
import { getUserProfile } from '$lib/services/userService';
import { type Player } from '$lib/models/player';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const user: Player = await getUserProfile(params.id);

		return json(user);
	} catch (error) {

		if (error instanceof Error) {
			if (error.message === 'User not found') {
				return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
			}
		}

		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
};

import type { RequestHandler } from './$types';
import { getUserProfile } from '$lib/services/userService';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const user = await getUserProfile(params.id);
		return new Response(JSON.stringify(user), { status: 200 });
	} catch (error) {

		if (error instanceof Error) {
			if (error.message === 'User not found') {
				return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
			}
		}

		return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
	}
};
import type { RequestHandler } from './$types';
import { getUserProfile } from '$lib/services/userService';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const user = await getUserProfile(params.id);
		return json(user);
	} catch (error) {
		console.error(`Failed to fetch user ${params.id}:`, error);
		return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
	}
};

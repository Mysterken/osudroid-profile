import type { RequestHandler } from './$types';
import { getUserProfile } from '$lib/services/userService';
import { handleUserRequest } from '$lib/utils/errorHandler';

export const GET: RequestHandler = async ({ params }) => {
	return handleUserRequest(() => getUserProfile(params.id));
};

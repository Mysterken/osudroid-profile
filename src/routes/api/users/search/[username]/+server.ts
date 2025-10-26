import type { RequestHandler } from './$types';
import { searchUserByUsername } from '$lib/services/userService';
import { handleUserRequest } from '$lib/utils/errorHandler';

export const GET: RequestHandler = async ({ params }) => {
	return handleUserRequest(() => searchUserByUsername(params.username));
};

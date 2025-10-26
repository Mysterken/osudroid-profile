import type { RequestHandler } from './$types';
import { searchUserByUsername } from '$lib/services/userService';
import { handleUserRequest } from '$lib/utils/errorHandler';
import logger from '$lib/utils/logger';

export const GET: RequestHandler = async ({ params }) => {
	logger.info(`🔍 Searching for user with username: ${params.username}`);
	return handleUserRequest(() => searchUserByUsername(params.username));
};

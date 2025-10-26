import type { RequestHandler } from './$types';
import { getUserProfile } from '$lib/services/userService';
import { handleUserRequest } from '$lib/utils/errorHandler';
import logger from '$lib/utils/logger';

export const GET: RequestHandler = async ({ params }) => {
	logger.info(`👤 Fetching profile for user ID: ${params.id}`);
	return handleUserRequest(() => getUserProfile(params.id));
};

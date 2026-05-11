import type { RequestHandler } from './$types';
import { handleLeaderboardRequest } from '$lib/utils/errorHandler';
import logger from '$lib/utils/logger';
import { getLeaderboard } from '$lib/services/leaderboardService';

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type') ?? 'pp';
	const country = url.searchParams.get('country') ?? 'all';
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const limit = parseInt(url.searchParams.get('limit') ?? '50');

	logger.info(`🏆 Fetching leaderboard data: ${type}, ${country}, ${page}, ${limit}`);
	return handleLeaderboardRequest(() => getLeaderboard(type, country, page, limit));
};

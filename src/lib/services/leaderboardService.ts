import { fetchLeaderboardFromApi } from '$lib/services/osudroidApi';

export interface LeaderboardPlayer {
	userId: number;
	username: string;
	score?: number;
	pp?: number;
	playcount: number;
	accuracy: number;
	country: string;
}

export interface Leaderboard {
	players: LeaderboardPlayer[];
	totalPages: number;
	currentPage: number;
}

export async function getLeaderboard(
	type: string,
	region: string,
	page: number,
	limit: number
): Promise<Leaderboard> {
	const leaderboardApi = await fetchLeaderboardFromApi(type, region, page, limit);

	if (!leaderboardApi) {
		throw new Error('Failed to fetch leaderboard');
	}

	const leaderboard = { players: [] as LeaderboardPlayer[], totalPages: leaderboardApi.TotalPages, currentPage: leaderboardApi.CurrentPage };

	for (const result of leaderboardApi.Results) {
		const player: LeaderboardPlayer = {
			userId: result.UserId,
			username: result.Username,
			pp: result.OverallPP ?? 0,
			score: result.OverallScore ?? 0,
			playcount: result.OverallPlaycount,
			accuracy: result.OverallAccuracy * 100,
			country: result.Region,
		};

		leaderboard.players.push(player);
	}

	return leaderboard;
}
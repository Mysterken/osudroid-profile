import axios from 'axios';
import { parsePlayerFromApi } from '$lib/models/player';
import { ApiError, NotFoundError } from '$lib/services/errors/userErrors';
import logger from '$lib/utils/logger';

const API_BASE_URL = 'https://new.osudroid.moe/api2/frontend';

export async function fetchUserFromApi(uid: string) {
	try {
		logger.debug(`Fetching user by UID from osu!droid API: ${uid}`);
		const response = await axios.get(`${API_BASE_URL}/profile-uid/${uid}`);
		return parsePlayerFromApi(response.data);
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;

			if (status === 404) {
				logger.warn(`🔍 User ${uid} not found in API.`);
				throw new NotFoundError(`User ${uid} not found in API`);
			}

			logger.error({ error }, `❌ osu!droid API error`);
			throw new ApiError(`osu!droid API request failed with status ${status}`);
		}

		// Unexpected error (e.g., network failure)
		logger.error({ error }, `❌ Unexpected error fetching user ${uid}`);
		throw new ApiError(`Unexpected error fetching user ${uid}`);
	}
}

export async function fetchUserFromApiByUsername(username: string) {
	try {
		logger.debug(`Fetching user by username from osu!droid API: ${username}`);
		const response = await axios.get(`${API_BASE_URL}/profile-username/${username}`);
		return parsePlayerFromApi(response.data);
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;

			if (status === 404) {
				logger.warn(`🔍 User ${username} not found in API.`);
				throw new NotFoundError(`User ${username} not found in API`);
			}

			logger.error({ error }, `❌ osu!droid API error`);
			throw new ApiError(`osu!droid API request failed with status ${status}`);
		}

		logger.error({ error }, `❌ Unexpected error fetching user ${username}`);
		throw new ApiError(`Unexpected error fetching user ${username}`);
	}
}

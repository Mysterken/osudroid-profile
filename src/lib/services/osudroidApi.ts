import axios from 'axios';
import { parsePlayerFromApi } from '$lib/models/player';
import { ApiError, NotFoundError } from '$lib/services/errors/userErrors';

const API_BASE_URL = 'https://new.osudroid.moe/apitest';

export async function fetchUserFromApi(uid: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/profile-uid/${uid}`);
		return parsePlayerFromApi(response.data);
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;

			if (status === 404) {
				console.warn(`🔍 User ${uid} not found in API.`);
				throw new NotFoundError(`User ${uid} not found in API`);
			}

			console.error(`❌ osu! API error (Status ${status}):`, error.message);
			throw new ApiError(`osu! API request failed with status ${status}`);
		}

		// Unexpected error (e.g., network failure)
		console.error(`❌ Unexpected error fetching user ${uid}:`, error);
		throw new ApiError(`Unexpected error fetching user ${uid}`);
	}
}

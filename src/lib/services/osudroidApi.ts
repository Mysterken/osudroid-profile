import axios from 'axios';
import { parsePlayerFromApi } from '$lib/models/player';

const API_BASE_URL = 'https://new.osudroid.moe/apitest';

export async function fetchUserFromApi(uid: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/profile-uid/${uid}`);
		return parsePlayerFromApi(response.data);
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				console.warn(`User ${uid} not found`);
				return null;
			}
		}

		console.error(error);
		console.warn(`API request failed for user ${uid}, falling back to scraping.`);

		throw new Error('API request failed');
	}
}

import axios from 'axios';

const API_BASE_URL = 'https://new.osudroid.moe/apitest'; // Example API endpoint

export async function fetchUserFromApi(uid: string) {
	try {
		const response = await axios.get(`${API_BASE_URL}/profile-uid/${uid}`);
		return response.data; // Assuming the API returns JSON
	} catch (error) {
		console.error(error);
		console.warn(`API request failed for user ${uid}, falling back to scraping.`);
		return null; // Return null to trigger fallback
	}
}

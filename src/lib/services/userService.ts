import { fetchUserFromApi } from './osudroidApi';
import { scrapeUserData } from './scraper/osudroidScraper';

export async function getUserProfile(uid: string) {
	const userData = await fetchUserFromApi(uid);

	if (userData === null) {
		// API returned 404
		throw new Error('User not found');
	}

	if (!userData) {
		console.log(`Falling back to web scraping for user ${uid}`);
		return await scrapeUserData(uid);
	}

	return userData;
}

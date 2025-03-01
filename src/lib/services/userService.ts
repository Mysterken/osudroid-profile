import { fetchUserFromApi } from './osudroidApi';
import type { ApiPlayer, ScraperPlayer } from '$lib/models/player';
import { scrapeUserData } from '$lib/services/scraper/osudroidScraper';

export async function getUserProfile(uid: string): Promise<ApiPlayer | ScraperPlayer> {
	let userData: ApiPlayer | ScraperPlayer | null;

	userData = await fetchUserFromApi(uid);

	if (!userData) {
		console.log(`Falling back to web scraping for user ${uid}`);
		userData = await scrapeUserData(uid);
	}

	if (!userData) {
		throw new Error('User not found');
	}

	return userData;
}

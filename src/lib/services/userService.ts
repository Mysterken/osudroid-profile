import { fetchUserFromApi } from './osudroidApi';
import { scrapeUserData } from './scraper/osudroidScraper';

export async function getUserProfile(uid: string) {
	let userData = await fetchUserFromApi(uid);

	if (!userData) {
		console.log(`Falling back to web scraping for user ${uid}`);
		userData = await scrapeUserData(uid);
	}

	return userData;
}

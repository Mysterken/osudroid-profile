import { fetchUserFromApi } from '$lib/services/osudroidApi';
import type { ApiPlayer, ScraperPlayer } from '$lib/models/player';
import { NotFoundError } from '$lib/services/errors/userErrors';
import { scrapeUserData } from '$lib/services/scraper/osudroidScraper';

export async function getUserProfile(uid: string): Promise<ApiPlayer | ScraperPlayer> {
	try {
		// Try API first
		return await fetchUserFromApi(uid);
	} catch (error) {
		if (error instanceof NotFoundError) {
			console.log(`🔄 Fallback to web scraping for user ${uid}`);

			try {
				return await scrapeUserData(uid);
			} catch (scraperError) {
				console.error(`❌ Both API and Scraper failed for user ${uid}`, scraperError);
				throw new NotFoundError(`User ${uid} not found in API or scraper`);
			}
		}

		throw error;
	}
}

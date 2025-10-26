import { fetchUserFromApi, fetchUserFromApiByUsername } from '$lib/services/osudroidApi';
import { scrapeUserData } from '$lib/services/scraper/osudroidScraper';
import {
	type ApiPlayer,
	type MergedPlayer,
	mergePlayers,
	type ScraperPlayer
} from '$lib/models/player';
import { NotFoundError } from '$lib/services/errors/userErrors';

export async function getUserProfile(
	uid: string
): Promise<ApiPlayer | ScraperPlayer | MergedPlayer> {
	const [apiResult, scraperResult] = await Promise.allSettled([
		fetchUserFromApi(uid),
		scrapeUserData(uid)
	]);

	const api = apiResult.status === 'fulfilled' ? apiResult.value : null;
	const scraper = scraperResult.status === 'fulfilled' ? scraperResult.value : null;

	if (!api && !scraper) throw new NotFoundError(`User ${uid} not found in API or scraper`);

	if (api && !scraper) return api;
	if (!api && scraper) return scraper;

	return mergePlayers(api as ApiPlayer, scraper as ScraperPlayer);
}

export async function searchUserByUsername(
	username: string
): Promise<ApiPlayer | ScraperPlayer | MergedPlayer> {
	const [apiResult, scraperResult] = await Promise.allSettled([
		fetchUserFromApiByUsername(username),
		scrapeUserData((await fetchUserFromApiByUsername(username)).UserId.toString())
	]);

	const api = apiResult.status === 'fulfilled' ? apiResult.value : null;
	const scraper = scraperResult.status === 'fulfilled' ? scraperResult.value : null;

	if (!api && !scraper) throw new NotFoundError(`User ${username} not found in API or scraper`);

	if (api && !scraper) return api;
	if (!api && scraper) return scraper;

	return mergePlayers(api as ApiPlayer, scraper as ScraperPlayer);
}

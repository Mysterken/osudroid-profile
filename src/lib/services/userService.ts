import { fetchUserFromApi } from './osudroidApi';
import type { Player } from '$lib/models/player';

export async function getUserProfile(uid: string): Promise<Player> {
	let userData = await fetchUserFromApi(uid);

	if (!userData) {
		// TODO: Implement web scraping
		// return await scrapeUserData(uid);
		console.log(`Falling back to web scraping for user ${uid}`);
		userData = await fetchUserFromApi(uid);
	}

	if (!userData) {
		throw new Error('User not found');
	}

	return userData;
}

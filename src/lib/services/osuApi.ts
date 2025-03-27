import { OSU_CLIENT_ID, OSU_CLIENT_SECRET } from '$env/static/private';
import { ApiError, MissingError, NotFoundError } from '$lib/services/errors/osuApiError';
import axios from 'axios';
import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';

const API_BASE_URL = 'https://osu.ppy.sh/api/v2';
const TOKEN_URL = 'https://osu.ppy.sh/oauth/token';

// Global variables to store the token and expiry time
let osuAccessToken: string | null = null;
let tokenExpiry: number | null = null;

async function callApi(url: string) {
	const token = await refreshTokenIfNeeded();

	return axios.get(url, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
}

/**
 * Get a new osu! API token and store it.
 */
async function fetchNewToken(): Promise<string> {
	console.log('Fetching new osu! API token...');

	const params = new URLSearchParams({
		grant_type: 'client_credentials',
		client_id: OSU_CLIENT_ID ?? '',
		client_secret: OSU_CLIENT_SECRET ?? '',
		scope: 'public'
	});

	const response = await axios.post(TOKEN_URL, params.toString(), {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		}
	});

	osuAccessToken = response.data.access_token;
	tokenExpiry = Date.now() + response.data.expires_in * 1000; // Convert seconds to milliseconds

	console.log('New osu! API token acquired.');

	return osuAccessToken!;
}

/**
 * Ensures the osu! API token is valid, refreshing it if needed.
 */
async function refreshTokenIfNeeded(): Promise<string> {
	if (!osuAccessToken || !tokenExpiry || Date.now() >= tokenExpiry) {
		return await fetchNewToken();
	}
	return osuAccessToken;
}

/**
 * Lookup a beatmap using the osu! API.
 */
export async function lookupBeatmap(filename?: string, hash?: string): Promise<BeatmapExtended> {
	let query = '';

	if (hash) {
		query = `checksum=${encodeURIComponent(hash)}`;
	} else if (filename) {
		const decodedFilename = decodeURIComponent(filename)
			.replace(/[/?:*"]/g, '') // Remove /, ?, :, *, "
			.replace(/&/g, '%26') // Replace & with %26
			.replace(/#/g, '%23'); // Replace # with %23

		query = `filename=${decodedFilename}.osu`;
	} else {
		throw new MissingError('No filename or checksum provided for beatmap lookup');
	}

	try {
		const response = await callApi(`${API_BASE_URL}/beatmaps/lookup?${query}`);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;

			if (status === 404) {
				console.warn(`🔍 Beatmap ${filename || hash} not found.`);
				throw new NotFoundError(`Beatmap ${filename || hash} not found`);
			}

			console.error(`❌ osu! API error (Status ${status}):`, error.message);
			throw new ApiError(`osu! API request failed with status ${status}`);
		}

		console.error(`❌ Unexpected error fetching beatmap ${filename || hash}:`, error);
		throw new ApiError(`Unexpected error fetching beatmap ${filename || hash}`);
	}
}

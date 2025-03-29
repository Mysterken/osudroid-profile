import fs from 'fs/promises';
import path from 'path';

const CACHE_PATH = path.resolve('data/hashToIdCache.json');

export async function loadHashCache(): Promise<Map<string, number>> {
	try {
		const raw = await fs.readFile(CACHE_PATH, 'utf-8');
		const json = JSON.parse(raw) as Record<string, number>;
		return new Map(Object.entries(json));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		console.warn('⚠️ No hash cache found, starting fresh.');
		return new Map();
	}
}

export async function saveHashCache(cache: Map<string, number>) {
	const obj = Object.fromEntries(cache.entries());
	await fs.writeFile(CACHE_PATH, JSON.stringify(obj, null, 2), 'utf-8');
}

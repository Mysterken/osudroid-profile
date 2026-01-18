import fs from 'fs/promises';
import path from 'path';
import logger from '$lib/utils/logger';

const CACHE_PATH = path.resolve('data/hashToIdCache.json');
const WRITE_DEBOUNCE_MS = 5000; // 5 seconds

let memoryCache: Map<string, number> | null = null;
let writeTimeout: NodeJS.Timeout | null = null;
let isDirty = false;

export async function loadHashCache(): Promise<Map<string, number>> {
	if (memoryCache) {
		return memoryCache;
	}

	try {
		const raw = await fs.readFile(CACHE_PATH, 'utf-8');
		const json = JSON.parse(raw) as Record<string, number>;
		memoryCache = new Map(Object.entries(json));
		logger.info(`✅ Loaded ${memoryCache.size} hash mappings from cache`);
	} catch (error) {
		logger.warn({ error }, '⚠️ No hash cache found, starting fresh.');
		memoryCache = new Map();
	}

	return memoryCache;
}

export async function saveHashCache(cache: Map<string, number>) {
	memoryCache = cache;
	isDirty = true;

	if (writeTimeout) {
		clearTimeout(writeTimeout);
	}

	writeTimeout = setTimeout(async () => {
		if (!isDirty) return;

		try {
			const obj = Object.fromEntries(cache.entries());
			await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
			await fs.writeFile(CACHE_PATH, JSON.stringify(obj, null, 2), 'utf-8');
			isDirty = false;
			logger.debug(`💾 Saved ${cache.size} hash mappings to disk`);
		} catch (err) {
			logger.error({ err }, '❌ Failed to write hash cache to disk');
		}
	}, WRITE_DEBOUNCE_MS);
}

export async function flushHashCache() {
	if (writeTimeout) {
		clearTimeout(writeTimeout);
		writeTimeout = null;
	}

	if (!isDirty || !memoryCache) return;

	try {
		const obj = Object.fromEntries(memoryCache.entries());
		await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
		await fs.writeFile(CACHE_PATH, JSON.stringify(obj, null, 2), 'utf-8');
		isDirty = false;
		logger.info('💾 Flushed hash cache to disk');
	} catch (err) {
		logger.error({ err }, '❌ Failed to flush hash cache');
	}
}

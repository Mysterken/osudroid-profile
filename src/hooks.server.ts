import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { flushHashCache } from '$lib/services/cache/hashToId';

process.on('SIGTERM', async () => {
	await flushHashCache();
	process.exit(0);
});

process.on('SIGINT', async () => {
	await flushHashCache();
	process.exit(0);
});

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

export const handle: Handle = paraglideHandle;

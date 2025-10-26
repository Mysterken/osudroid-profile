import { json } from '@sveltejs/kit';
import { ApiError, NotFoundError, ScraperError } from '$lib/services/errors/userErrors';
import logger from '$lib/utils/logger';

export async function handleUserRequest<T>(handler: () => Promise<T>): Promise<Response> {
	try {
		const result = await handler();
		return json(result);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return json({ error: error.message }, { status: 404 });
		}

		if (error instanceof ApiError || error instanceof ScraperError) {
			logger.error({ error }, '❌ External data source error');
			return json({ error: 'External data source failed' }, { status: 502 });
		}

		logger.error({ error }, '❌ Unexpected error in user route');
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

import type { ApiPlayer, MergedPlayer, ScraperPlayer } from '$lib/models/player';

type User = ApiPlayer | ScraperPlayer | MergedPlayer;

export function getUserField<T extends keyof (ApiPlayer & ScraperPlayer & MergedPlayer)>(
	user: User | null,
	field: T,
	defaultValue: (ApiPlayer & ScraperPlayer & MergedPlayer)[T] | string | number | null = null
) {
	if (!user) return defaultValue;

	const hasField = field in user;

	if (
		(user.Source === 'api' && hasField) ||
		(user.Source === 'scraper' && hasField) ||
		(user.Source === 'merged' && hasField)
	) {
		return user[field as keyof User] ?? defaultValue;
	}

	return defaultValue;
}

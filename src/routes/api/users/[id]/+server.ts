import { json } from '@sveltejs/kit';

export function GET({ params }) {
	const { id } = params;

	return json({ id: id });
}

import { Medal } from 'lucide-svelte';
import type { Component } from 'svelte';

export const AVATAR_BASE_URL = 'https://osudroid.moe/user/avatar?id=';
export const PAGINATION_MAX_VISIBLE = 7;
export const PAGINATION_ELLIPSIS = '...';

export type PageItem = number | typeof PAGINATION_ELLIPSIS;

export function getPlayerAvatarUrl(userId: number): string {
	return `${AVATAR_BASE_URL}${userId}`;
}

export function getRankColor(rank: number): string {
	if (rank === 1) return 'text-yellow-400';
	if (rank === 2) return 'text-gray-300';
	if (rank === 3) return 'text-amber-600';
	return 'text-gray-400';
}

export function getRankIcon(rank: number): Component | null {
	return rank <= 3 ? (Medal as unknown as Component) : null;
}

const numberFormatter = new Intl.NumberFormat();
export function formatNumber(num: number): string {
	return numberFormatter.format(Math.round(num));
}

/**
 * Builds the list of page tokens to render in the pagination bar.
 * Always includes the first and last pages, with ellipses around the current window.
 */
export function getPageNumbers(currentPage: number, totalPages: number): PageItem[] {
	if (totalPages <= PAGINATION_MAX_VISIBLE) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const pages: PageItem[] = [1];

	if (currentPage > 3) pages.push(PAGINATION_ELLIPSIS);

	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);
	for (let i = start; i <= end; i++) pages.push(i);

	if (currentPage < totalPages - 2) pages.push(PAGINATION_ELLIPSIS);

	if (totalPages > 1) pages.push(totalPages);

	return pages;
}

/**
 * Computes the absolute rank of a player at `index` within `currentPage`.
 */
export function computeRank(currentPage: number, playersPerPage: number, index: number): number {
	return (currentPage - 1) * playersPerPage + index + 1;
}

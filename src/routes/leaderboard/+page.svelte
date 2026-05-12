<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
	import LeaderboardFilters from '$lib/components/leaderboard/LeaderboardFilters.svelte';
	import { TrophyIcon } from 'lucide-svelte';
	import LeaderboardTable from '$lib/components/leaderboard/LeaderboardTable.svelte';
	import type { LeaderboardPlayer } from '$lib/services/leaderboardService';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const playersPerPage = 50;

	// Initialize state from URL parameters
	let rankingType = $state<'pp' | 'score'>(
		(page.url.searchParams.get('type') as 'pp' | 'score') || 'pp'
	);
	let selectedCountry = $state<string>(page.url.searchParams.get('country') || 'all');
	let currentPage = $state(parseInt(page.url.searchParams.get('page') || '1', 10));

	let isLoading = $state(true);
	let players = $state<LeaderboardPlayer[]>([]);
	let totalPages = $state(10);
	let totalCount = $state(0);

	// Track the current fetch request to prevent race conditions
	let fetchController: AbortController | null = null;

	async function fetchLeaderboard() {
		// Cancel any pending request
		if (fetchController) {
			fetchController.abort();
		}

		fetchController = new AbortController();
		const signal = fetchController.signal;

		isLoading = true;

		try {
			let response = await fetch(
				`/api/leaderboard?type=${rankingType}&country=${selectedCountry}&page=${currentPage}&limit=${playersPerPage}`,
				{ signal }
			);
			if (!response.ok) return null;

			let data = await response.json();

			// Only update if this request wasn't aborted
			if (!signal.aborted) {
				players = data.players;
				totalPages = data.totalPages;
				totalCount = totalPages * playersPerPage;
			}
		} catch (error) {
			// Ignore abort errors
			if (error instanceof Error && error.name === 'AbortError') {
				return;
			}
			console.error('Failed to fetch leaderboard:', error);
		} finally {
			if (!signal.aborted) {
				isLoading = false;
			}
		}
	}

	// Update URL when state changes
	function updateUrl() {
		const params = new URL(page.url).searchParams;

		// Clear existing params
		params.delete('type');
		params.delete('country');
		params.delete('page');

		// Set new params (only non-defaults)
		if (rankingType !== 'pp') params.set('type', rankingType);
		if (selectedCountry !== 'all') params.set('country', selectedCountry);
		if (currentPage !== 1) params.set('page', currentPage.toString());

		const queryString = params.toString();
		const newUrl = queryString ? `?${queryString}` : resolve('/leaderboard');

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(newUrl, {
			keepFocus: true,
			noScroll: true,
			replaceState: false
		});
	}

	function handleFilterChange(type: typeof rankingType, country: string) {
		rankingType = type;
		selectedCountry = country;
		currentPage = 1;
		updateUrl();
		fetchLeaderboard();
	}

	function handlePageChange(page: number) {
		currentPage = page;
		updateUrl();
		fetchLeaderboard();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Sync state with URL changes (browser back/forward) and fetch data
	$effect(() => {
		const urlType = (page.url.searchParams.get('type') as 'pp' | 'score') || 'pp';
		const urlCountry = page.url.searchParams.get('country') || 'all';
		const urlPage = parseInt(page.url.searchParams.get('page') || '1', 10);

		// Check if URL differs from current state
		const stateChanged =
			rankingType !== urlType || selectedCountry !== urlCountry || currentPage !== urlPage;

		// Update state to match URL
		if (stateChanged) {
			rankingType = urlType;
			selectedCountry = urlCountry;
			currentPage = urlPage;
		}

		// Always fetch with current state (whether from URL change or initial load)
		fetchLeaderboard();
	});
</script>

<svelte:head>
	<title>Leaderboard - osu!droid</title>
	<meta property="og:title" content="Leaderboard - osu!droid" />
	<meta
		property="og:description"
		content="View the top osu!droid players ranked by performance points, score, and more."
	/>
</svelte:head>

<SearchBar />

<ContentLayout>
	<div class="flex flex-col gap-6 py-6">
		<div class="flex items-center gap-4">
			<div class="flex items-center justify-center size-16 rounded-2xl">
				<TrophyIcon size={32} class="text-white" />
			</div>
			<div>
				<h1 class="text-3xl tablet-sm:text-4xl font-extrabold text-white">Leaderboard</h1>
				<p class="text-gray-400 mt-1">Top players in the osu!droid community</p>
			</div>
		</div>

		<LeaderboardFilters
			bind:rankingType
			bind:selectedCountry
			onFilterChange={handleFilterChange}
		/>

		<LeaderboardTable
			{players}
			{rankingType}
			{isLoading}
			{currentPage}
			{totalPages}
			{playersPerPage}
			{totalCount}
			onPageChange={handlePageChange}
		/>
	</div>
</ContentLayout>

<Footer />
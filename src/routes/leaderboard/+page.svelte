<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
	import LeaderboardTable, { type LeaderboardPlayer } from '$lib/components/leaderboard/LeaderboardTable.svelte';
	import LeaderboardFilters from '$lib/components/leaderboard/LeaderboardFilters.svelte';
	import { TrophyIcon } from 'lucide-svelte';

	let rankingType = $state<'pp' | 'score'>('pp');
	let selectedCountry = $state<string>('all');
	let currentPage = $state(1);
	let isLoading = $state(true);
	let players = $state<LeaderboardPlayer[]>([]);
	let totalPages = $state(10);

	const playersPerPage = 50;

	async function fetchLeaderboard() {
		isLoading = true;

		try {
			let response = await fetch(`/api/leaderboard?type=${rankingType}&country=${selectedCountry}&page=${currentPage}&limit=${playersPerPage}`);
			if (!response.ok) return null;

			players = await response.json().then(res => res.players);
		} catch (error) {
			console.error('Failed to fetch leaderboard:', error);
			isLoading = false;
			return;
		}

		isLoading = false;
	}

	function handleFilterChange(type: typeof rankingType, country: string) {
		rankingType = type;
		selectedCountry = country;
		currentPage = 1;
		fetchLeaderboard();
	}

	function handlePageChange(page: number) {
		currentPage = page;
		fetchLeaderboard();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	$effect(() => {
		fetchLeaderboard();
	});
</script>

<svelte:head>
	<title>Leaderboard - osu!droid</title>
	<meta property="og:title" content="Leaderboard - osu!droid" />
	<meta property="og:description"
	      content="View the top osu!droid players ranked by performance points, score, and more." />
</svelte:head>

<SearchBar />

<ContentLayout>
	<div class="flex flex-col gap-6 py-6">
		<div class="flex items-center gap-4">
			<div class="flex items-center justify-center size-16 rounded-2xl">
				<TrophyIcon size={32} class="text-white" />
			</div>
			<div>
				<h1 class="text-3xl tablet-sm:text-4xl font-extrabold text-white">
					Leaderboard
				</h1>
				<p class="text-gray-400 mt-1">
					Top players in the osu!droid community
				</p>
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
			onPageChange={handlePageChange}
		/>
	</div>
</ContentLayout>

<Footer />
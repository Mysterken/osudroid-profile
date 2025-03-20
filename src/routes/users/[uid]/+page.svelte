<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApiPlayer, ScraperPlayer } from '$lib/models/player';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ProfileInfoMobile from '$lib/components/users/profile-info/ProfileInfoMobile.svelte';
	import ProfileInfoDesktop from '$lib/components/users/profile-info/ProfileInfoDesktop.svelte';
	import TopPlays from '$lib/components/users/top-plays/TopPlays.svelte';
	import RecentPlays from '$lib/components/users/recent-plays/RecentPlays.svelte';
	import RankingPanel from '$lib/components/users/side-stats/RankingPanel.svelte';
	import StatisticsPanel from '$lib/components/users/side-stats/StatisticsPanel.svelte';
	import UserInfoPanel from '$lib/components/users/side-stats/UserInfoPanel.svelte';
	import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';
	import type { Play } from '$lib/models/play';

	let user = $state<ApiPlayer | ScraperPlayer | null>(null);
	let globalRank = $state(0);
	let countryRank = $state(0);
	let scoreRank = $state(0);
	let ppRank = $state(0);
	let registered = $state('');
	let lastLogin = $state('');
	let beatmaps = $state([] as (BeatmapExtended | null)[]);

	let isLoading = $state(true);
	let topPlaysToShow = $state(5);
	let recentPlaysToShow = 5;
	let isFetchingMore = false;

	async function fetchUser(userId: string): Promise<ApiPlayer | ScraperPlayer | null> {
		try {
			const response = await fetch(`/api/users/${userId}`);
			if (!response.ok) return null;
			return (await response.json()) as ApiPlayer | ScraperPlayer;
		} catch (error) {
			console.error('Error fetching user:', error);
			return null;
		}
	}

	async function fetchBeatmapData(filename: string): Promise<BeatmapExtended | null> {
		try {
			filename = encodeURIComponent(filename);
			const response = await fetch(`/api/beatmaps/${filename}`);
			if (!response.ok) return null;
			return await response.json();
		} catch (error) {
			console.error(`Error fetching beatmap for ${filename}:`, error);
			return null;
		}
	}

	async function fetchInitialBeatmaps(topPlays: Play[]) {
		beatmaps = await Promise.all(topPlays.slice(0, 5).map(play => fetchBeatmapData(play.Filename)));
	}

	async function fetchAdditionalBeatmaps(topPlays: Play[]) {
		const additionalBeatmaps = await Promise.all(topPlays.slice(5, 25).map(play => fetchBeatmapData(play.Filename)));
		beatmaps = [...beatmaps, ...additionalBeatmaps];
	}

	async function fetchRemainingBeatmaps(topPlays: Play[]) {
		if (isFetchingMore || beatmaps.length >= topPlays.length) return;
		isFetchingMore = true;
		const remainingBeatmaps = await Promise.all(topPlays.slice(25, 50).map(play => fetchBeatmapData(play.Filename)));
		beatmaps = [...beatmaps, ...remainingBeatmaps];
		isFetchingMore = false;
	}

	onMount(async () => {
		const userId = window.location.pathname.split('/').pop() || '';
		user = await fetchUser(userId);

		if (user?.Source === 'api') {
			({
				GlobalRank: globalRank,
				CountryRank: countryRank,
				Registered: registered,
				LastLogin: lastLogin
			} = user);
		} else if (user?.Source === 'scraper') {
			({ ScoreRank: scoreRank, PPRank: ppRank } = user);
		} else {
			user = null;
		}

		if (user?.Top50Plays) {
			await fetchInitialBeatmaps(user.Top50Plays);
			fetchAdditionalBeatmaps(user.Top50Plays);
		}

		isLoading = false;
	});

	// Fetch remaining beatmaps **when user requests more plays**
	$effect(() => {
		if (topPlaysToShow === 25 && user?.Top50Plays) {
			fetchRemainingBeatmaps(user.Top50Plays);
		}
	});
</script>

<SearchBar />

<ContentLayout>
	{#if isLoading}
		<p>Loading user data...</p>
	{:else}
		{#if user}
			<!-- Desktop Layout -->
			<div class="hidden desktop-sm:grid grid-cols-[1fr_3fr] gap-8">
				<!-- Sidebar -->
				<div class="flex flex-col gap-4 w-[300px]">
					<RankingPanel
						source={user.Source}
						globalRanking={globalRank}
						countryRanking={countryRank}
						scoreRanking={scoreRank}
						ppRanking={ppRank}
					/>
					<StatisticsPanel
						source={user.Source}
						performancePoints={user.OverallPP}
						score={user.OverallScore}
						accuracy={user.OverallAccuracy}
						playcount={user.OverallPlaycount}
					/>
					{#if user.Source === 'api'}
						<UserInfoPanel
							registered={registered}
							lastLogin={lastLogin}
						/>
					{/if}
				</div>

				<!-- Main Content -->
				<div class="flex flex-col gap-8">
					<ProfileInfoDesktop
						avatarLink="https://osudroid.moe/user/avatar/{user.UserId}.png"
						username={user.Username}
						country={user.Region}
					/>
					<TopPlays topPlays={user.Top50Plays} bind:itemsToShow={topPlaysToShow} {beatmaps} />
					<RecentPlays recentPlays={user.Last50Scores} itemsToShow={recentPlaysToShow} />
				</div>
			</div>

			<!-- Mobile/Tablet Layout -->
			<div
				class="
				desktop-sm:hidden
				flex flex-col
				phone-sm:gap-2.5 phone-sm:py-2.5
				phone-lg:gap-3.5 phone-lg:py-3.5
				tablet-sm:gap-5 tablet-sm:p-5
				tablet-lg:gap-6 tablet-lg:p-6"
			>
				<ProfileInfoMobile
					source={user.Source}
					username={user.Username}
					country={user.Region}
					avatarLink="https://osudroid.moe/user/avatar/{user.UserId}.png"
					globalRanking={globalRank}
					countryRanking={countryRank}
					scoreRanking={scoreRank}
					ppRanking={ppRank}
					performancePoints={user.OverallPP}
					score={user.OverallScore}
					accuracy={user.OverallAccuracy}
					playcount={user.OverallPlaycount}
					registered={registered}
					lastLogin={lastLogin}
				/>
				<TopPlays topPlays={user.Top50Plays} bind:itemsToShow={topPlaysToShow} {beatmaps} />
				<RecentPlays recentPlays={user.Last50Scores} itemsToShow={recentPlaysToShow} />
			</div>

		{:else}
			<p>User not found.</p>
		{/if}
	{/if}
</ContentLayout>
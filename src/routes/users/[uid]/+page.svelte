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

	let user: ApiPlayer | ScraperPlayer | null = null;
	let globalRank: number | null = null;
	let countryRank: number | null = null;
	let scoreRank: number | null = null;
	let ppRank: number | null = null;
	let registered: string | null = null;
	let lastLogin: string | null = null;
	let beatmaps: (BeatmapExtended | null)[] = [];

	let isLoading = true;

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
			const response = await fetch(`/api/beatmaps/${filename}`);
			if (!response.ok) return null;
			return await response.json();
		} catch (error) {
			console.error(`Error fetching beatmap for ${filename}:`, error);
			return null;
		}
	}

	// Fetch the first 5 beatmaps
	async function fetchInitialBeatmaps(topPlays: Play[]) {
		const requests = topPlays.slice(0, 5).map((play) => fetchBeatmapData(play.Filename));
		beatmaps = await Promise.all(requests);
	}

	async function fetchAdditionalBeatmaps(topPlays: Play[]) {
		const requests = topPlays.slice(5, 25).map((play) => fetchBeatmapData(play.Filename));
		const additionalBeatmaps = await Promise.all(requests);

		beatmaps = [...beatmaps, ...additionalBeatmaps];
	}

	onMount(async () => {
		const userId = window.location.pathname.split('/').pop() || '';
		user = await fetchUser(userId);

		if (user?.Source === "api") {
			({
				GlobalRank: globalRank,
				CountryRank: countryRank,
				Registered: registered,
				LastLogin: lastLogin
			} = user);
		} else if (user?.Source === "scraper") {
			({
				ScoreRank: scoreRank,
				PPRank: ppRank
			} = user);
		} else {
			user = null;
		}

		// Fetch beatmaps for first 5 top plays
		if (user?.Top50Plays) {
			await fetchInitialBeatmaps(user.Top50Plays);
			// Start fetching additional 25 beatmaps in the background
			fetchAdditionalBeatmaps(user.Top50Plays);
		}

		isLoading = false;
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
						avatarLink=""
						username={user.Username}
						country={user.Region}
					/>
					<TopPlays topPlays={user.Top50Plays} {beatmaps} />
					<RecentPlays recentPlays={user.Last50Scores} />
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
					avatarLink=""
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
				<TopPlays topPlays={user.Top50Plays} {beatmaps} />
				<RecentPlays recentPlays={user.Last50Scores}/>
			</div>

		{:else}
			<p>User not found.</p>
		{/if}
	{/if}
</ContentLayout>

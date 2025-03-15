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

	let user: ApiPlayer | ScraperPlayer | null = null;
	let globalRank: number | null = null;
	let countryRank: number | null = null;
	let scoreRank: number | null = null;
	let ppRank: number | null = null;
	let registered: string | null = null;
	let lastLogin: string | null = null;

	let isLoading = true;

	async function fetchUser(userId: string): Promise<ApiPlayer | ScraperPlayer | null> {
		try {
			// const response = await fetch(`/api/users/${userId}`);
			console.log(userId)
			const response = await fetch(`/test/33306.json`);
			if (!response.ok) return null;
			return (await response.json()) as ApiPlayer | ScraperPlayer;
		} catch (error) {
			console.error('Error fetching user:', error);
			return null;
		}
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

		isLoading = false;
	});



	// user = {
	// 	Username: "John Doe",
	// };
	isLoading = false;
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
					<TopPlays />
					<RecentPlays />
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
				<TopPlays />
				<RecentPlays />
			</div>

		{:else}
			<p>User not found.</p>
		{/if}
	{/if}
</ContentLayout>

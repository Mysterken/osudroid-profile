<script lang="ts">
	// import { onMount } from 'svelte';
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
	let isLoading = true;

	// async function fetchUser(userId: string): Promise<ApiPlayer | ScraperPlayer | null> {
	// 	try {
	// 		const response = await fetch(`/api/users/${userId}`);
	// 		if (!response.ok) return null;
	// 		return (await response.json()) as ApiPlayer | ScraperPlayer;
	// 	} catch (error) {
	// 		console.error("Error fetching user:", error);
	// 		return null;
	// 	}
	// }
	//
	// onMount(async () => {
	// 	const userId = window.location.pathname.split('/').pop() || "";
	// 	user = await fetchUser(userId);
	// 	isLoading = false;
	// });

	user = {
		Username: "John Doe",
	};
	isLoading = false;
</script>

<SearchBar/>

<ContentLayout>
	{#if isLoading}
		<p>Loading user data...</p>
	{:else}
		{#if user}
			<!-- Desktop Layout -->
			<div class="hidden desktop-sm:grid grid-cols-[1fr_3fr] gap-8">
				<!-- Sidebar -->
				<div class="flex flex-col gap-4 w-[300px]">
					<RankingPanel />
					<StatisticsPanel />
					<UserInfoPanel />
				</div>

				<!-- Main Content -->
				<div class="flex flex-col gap-4">
					<ProfileInfoDesktop />
					<TopPlays />
					<RecentPlays />
				</div>
			</div>

			<!-- Mobile/Tablet Layout -->
			<div class="desktop-sm:hidden flex flex-col gap-4">
				<ProfileInfoMobile />
				<TopPlays />
				<RecentPlays />
			</div>

		{:else}
			<p>User not found.</p>
		{/if}
	{/if}
</ContentLayout>

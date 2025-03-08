<script lang="ts">
	// import { onMount } from 'svelte';
	import type { ApiPlayer, ScraperPlayer } from '$lib/models/player';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import ProfileInfoMobile from '$lib/components/users/ProfileInfoMobile.svelte';
	import { breakpoints, screenSize } from '$lib/stores/screenSize';
	import ProfileInfoDesktop from '$lib/components/users/ProfileInfoDesktop.svelte';
	import TopPlays from '$lib/components/users/TopPlays.svelte';
	import RecentPlays from '$lib/components/users/RecentPlays.svelte';

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
			{#if $screenSize < breakpoints.desktopSm}
				<ProfileInfoMobile/>
			{:else}
				<ProfileInfoDesktop/>
			{/if}
			<TopPlays/>
			<RecentPlays/>
		{:else}
			<p>User not found.</p>
		{/if}
	{/if}
</ContentLayout>
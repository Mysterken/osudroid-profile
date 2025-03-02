<script lang="ts">
	// import { onMount } from 'svelte';
	import type { ApiPlayer, ScraperPlayer } from '$lib/models/player';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';

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
			<div style="background-color: #476426"><h1>Hello {user.Username}</h1></div>
			<div style="background-color: #2077c4"><h1>card 2</h1></div>
			<div style="background-color: #8018b2"><h1>card 3</h1></div>
		{:else}
			<p>User not found.</p>
		{/if}
	{/if}
</ContentLayout>
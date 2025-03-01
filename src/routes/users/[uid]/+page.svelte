<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApiPlayer, ScraperPlayer } from '$lib/models/player';

	let user: ApiPlayer | ScraperPlayer | null = null;
	let isLoading = true;

	async function fetchUser(userId: string): Promise<ApiPlayer | ScraperPlayer | null> {
		try {
			const response = await fetch(`/api/users/${userId}`);
			if (!response.ok) return null;
			return (await response.json()) as ApiPlayer | ScraperPlayer;
		} catch (error) {
			console.error("Error fetching user:", error);
			return null;
		}
	}

	onMount(async () => {
		const userId = window.location.pathname.split('/').pop() || "";
		user = await fetchUser(userId);
		isLoading = false;
	});
</script>


{#if isLoading}
	<p>Loading user data...</p>
{:else}
	{#if user}
		<h1>Hello {user.Username}</h1>
	{:else}
		<p>User not found.</p>
	{/if}
{/if}

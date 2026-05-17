<script lang="ts">
	import { LoaderCircle, Search, TrophyIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { toaster } from '$lib/utils/toaster';

	let searchQuery = $state('');
	let searchMode = $state<'user' | 'beatmap'>('user');
	let hidden = $state(false);
	let lastScrollY = 0;
	let isSearching = $state(false);

	// Smart parser to handle various osu! link formats
	function parseBeatmapInput(input: string) {
		let mapId: string | null = null;
		let setId: string | null = null;

		// https://osu.ppy.sh/beatmapsets/1234#osu/5678 or https://osu.ppy.sh/beatmapsets/1234
		const setMapRegex = /beatmapsets\/(\d+)(?:#(?:osu|taiko|catch|mania)\/(\d+))?/;
		// https://osu.ppy.sh/b/5678 or https://osu.ppy.sh/beatmaps/5678
		const mapRegex = /\/(?:b|beatmaps)\/(\d+)/;
		// https://osu.ppy.sh/p/beatmap?b=5678
		const oldMapRegex = /[?&]b=(\d+)/;
		// Raw number (e.g. 5678)
		const numberRegex = /^\d+$/;

		if (setMapRegex.test(input)) {
			const match = input.match(setMapRegex);
			setId = match![1];
			mapId = match![2] || null;
		} else if (mapRegex.test(input)) {
			mapId = input.match(mapRegex)![1];
		} else if (oldMapRegex.test(input)) {
			mapId = input.match(oldMapRegex)![1];
		} else if (numberRegex.test(input)) {
			// If just a number is pasted, assume it's a specific Beatmap ID (most common)
			mapId = input;
		}

		return { mapId, setId };
	}

	async function resolveBeatmapUrl(input: string) {
		const { mapId, setId } = parseBeatmapInput(input);

		if (!mapId && !setId) {
			throw new Error('Please enter a valid Beatmap ID or osu! link.');
		}

		let resolvedSetId = setId;
		let resolvedMapId = mapId;

		// If we only have the Map ID, fetch the map details to find its parent Set ID
		if (mapId && !setId) {
			const res = await fetch(`/api/beatmaps/${mapId}`);
			if (!res.ok) throw new Error('Beatmap not found on the server.');
			const data = await res.json();
			resolvedSetId = data.beatmapset_id;
		}

		// If we only have a Set ID (e.g., they pasted a set link without the #osu/id part)
		if (setId && !mapId) {
			const res = await fetch(`/api/beatmapset/${setId}`);
			if (!res.ok) throw new Error('Beatmapset not found on the server.');
			const data = await res.json();
			if (data.beatmaps && data.beatmaps.length > 0) {
				// Default to the first difficulty available
				resolvedMapId = data.beatmaps[0].id;
			} else {
				throw new Error('This beatmapset contains no maps.');
			}
		}

		return { setId: resolvedSetId, mapId: resolvedMapId };
	}

	async function handleSearch(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchQuery.trim() !== '' && !isSearching) {
			isSearching = true;
			try {
				const query = searchQuery.trim();

				if (searchMode === 'user') {
					const username = encodeURIComponent(query);
					const response = await fetch(`/api/users/search/${username}`);

					if (!response.ok) {
						location.replace('/users/not-found');
						return;
					}

					const userData = await response.json();
					sessionStorage.setItem(`user_${userData.UserId}`, JSON.stringify(userData));
					location.replace(`/users/${userData.UserId}`);
				} else if (searchMode === 'beatmap') {
					// Handle the robust beatmap resolution
					const { setId, mapId } = await resolveBeatmapUrl(query);
					location.replace(`/leaderboard/beatmapsets/${setId}/${mapId}`);
				}
			} catch (error) {
				console.error('Search error:', error);
				toaster.error({
					title: 'Search Error',
					description: error instanceof Error ? error.message : 'An error occurred while searching'
				});
			} finally {
				isSearching = false;
			}
		}
	}

	onMount(() => {
		function onScroll() {
			const currentScrollY = window.scrollY;
			hidden = currentScrollY > lastScrollY && currentScrollY > 80;
			lastScrollY = currentScrollY;
		}

		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="
  bg-[#2A2A2A]
  sticky top-0 z-50
  transition-transform duration-300 ease-in-out
  {hidden ? '-translate-y-full' : 'translate-y-0'}
  desktop-sm:translate-y-0
  flex flex-col justify-center
  p-2 phone-sm:p-2.5 tablet-sm:p-3.5 desktop-sm:px-6 desktop-sm:py-4
  phone-sm:h16 tablet-sm:h-20 h-16"
>
	<div class="max-w-300 mx-auto w-full flex items-center gap-2 tablet-sm:gap-4">
		<a
			href={resolve('/')}
			class="flex items-center justify-center size-10 tablet-sm:size-12 shrink-0 p-1.5"
			aria-label="Home"
		>
			<img src="/favicon.png" alt="osu!droid hub logo" class="w-full h-full object-contain" />
		</a>

		<div
			class="flex items-center h-10 tablet-sm:h-12 grow max-w-3xl bg-[#565656] rounded-[10px] overflow-hidden"
		>
			<div class="flex items-center justify-center px-3 text-gray-300">
				{#if isSearching}
					<LoaderCircle size={16} class="animate-spin" />
				{:else}
					<Search size={16} />
				{/if}
			</div>

			<input
				class="flex-1 bg-transparent text-white outline-none placeholder-gray-400 text-sm h-full w-full min-w-0"
				type="search"
				placeholder={searchMode === 'user' ? 'Search username...' : 'Paste beatmap ID or link...'}
				bind:value={searchQuery}
				onkeydown={handleSearch}
				disabled={isSearching}
			/>

			<div class="relative flex items-center bg-[#3C3C3C] h-full shrink-0">
				<select
					bind:value={searchMode}
					class="appearance-none bg-transparent text-gray-200 font-semibold text-xs tablet-sm:text-sm outline-none border-none pl-3 pr-6 py-2 cursor-pointer focus:text-white h-full w-26 tablet-sm:w-32"
				>
					<option value="user" class="bg-[#2A2A2A]">Player</option>
					<option value="beatmap" class="bg-[#2A2A2A]">Beatmap</option>
				</select>
			</div>
		</div>

		<a
			href={resolve('/leaderboard')}
			class="flex items-center justify-center tablet-sm:px-4 size-10 tablet-sm:size-auto tablet-sm:py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-[10px] transition-colors whitespace-nowrap shrink-0"
			aria-label="Leaderboard"
		>
			<TrophyIcon size={20} class="tablet-sm:hidden" />
			<span class="hidden tablet-sm:inline">Leaderboard</span>
		</a>
	</div>
</nav>

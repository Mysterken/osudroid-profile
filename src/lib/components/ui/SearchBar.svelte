<script lang="ts">
	import { LoaderCircle, Search, TrophyIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let searchQuery = $state('');
	let hidden = $state(false);
	let lastScrollY = 0;
	let isSearching = $state(false);

	async function handleSearch(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchQuery.trim() !== '' && !isSearching) {
			isSearching = true;
			try {
				const username = encodeURIComponent(searchQuery.trim());
				const response = await fetch(`/api/users/search/${username}`);

				if (!response.ok) {
					location.replace('/users/not-found');
					return;
				}

				const userData = await response.json();
				// Store the fetched data to avoid re-fetching
				sessionStorage.setItem(`user_${userData.UserId}`, JSON.stringify(userData));
				location.replace(`/users/${userData.UserId}`);
			} catch (error) {
				console.error('Search error:', error);
				alert('An error occurred while searching');
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

		<!-- Search Bar -->
		<div class="input-group grid-cols-[auto_1fr_auto] h-full grow max-w-3xl bg-[#565656] rounded-[10px]">
			<div class="ig-cell preset-tonal">
				{#if isSearching}
					<LoaderCircle size={16} class="animate-spin" />
				{:else}
					<Search size={16} />
				{/if}
			</div>
			<input
				class="ig-input text-white shadow-inner"
				type="search"
				placeholder="Search player username..."
				bind:value={searchQuery}
				onkeydown={handleSearch}
				disabled={isSearching}
			/>
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

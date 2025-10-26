<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { onMount } from 'svelte';

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
					alert('User not found');
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
	<div class="max-w-[1200px] mx-auto size-full">
		<div class="input-group grid-cols-[auto_1fr_auto] size-full max-w-3xl bg-[#565656] rounded-[10px]">
			<div class="ig-cell preset-tonal">
				<Search size={16} />
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
	</div>
</nav>
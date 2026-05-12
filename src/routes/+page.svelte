<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
	import { resolve } from '$app/paths';
</script>

<SearchBar />

<main class="bg-linear-to-b from-[#1A1A1A] to-[#101010] min-h-[calc(100vh-150px)] flex flex-col justify-between">

	<section class="flex flex-col items-center justify-center text-center px-6 py-16 grow">

		<h1 class="text-4xl tablet-sm:text-5xl font-extrabold text-white mb-4">
			osu!droid Hub
		</h1>

		<p class="text-lg text-gray-400 max-w-lg">
			The central hub for <span class="text-white font-bold">osu!droid</span>.
			View detailed player statistics, leaderboards, <span class="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent font-semibold">and more</span>.
		</p>

		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a
				href={resolve('/leaderboard')}
				class="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
			>
				Global Leaderboard
			</a>
		</div>

		<p class="text-sm text-gray-500 mt-8">Or start by searching for a username above</p>
	</section>

</main>

<Footer />

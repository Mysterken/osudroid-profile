<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
</script>

<SearchBar />

<section
	class="
		flex flex-col items-center justify-center text-center
		min-h-[calc(100vh-150px)]
    phone-sm:min-h-[calc(100vh-170px+20px)]
    phone-lg:min-h-[calc(100vh-178px+28px)]
    tablet-sm:min-h-[calc(100vh-206px+40px)]
    tablet-lg:min-h-[calc(100vh-214px+48px)]
    desktop-sm:min-h-[calc(100vh-230px+64px)]
		px-6 py-12
		bg-gradient-to-b from-[#1A1A1A] to-[#101010]
	"
>
	<h1 class="text-4xl tablet-sm:text-5xl font-extrabold text-white mb-4">
		osu!droid Profile Viewer
	</h1>

	<p class="text-lg text-gray-400 max-w-lg">
		View detailed stats, top plays, and recent scores for any osu!droid player.
	</p>

	<p class="text-sm text-gray-500 mt-4">
		Try searching for a UID like <span class="font-mono bg-gray-800 text-white px-2 py-1 rounded">33306</span>
	</p>
</section>

<Footer />

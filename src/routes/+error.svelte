<script lang="ts">
	import { page } from '$app/state';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
	import { AlertCircleIcon, AngryIcon } from 'lucide-svelte';

	let status = page.status;
	let message = page.error?.message || 'An unexpected error occurred.';
</script>

<SearchBar />

<ContentLayout>
	<div
		class="
			flex flex-col items-center justify-center text-center px-4
			min-h-[calc(100vh-172px)]
			phone-sm:min-h-[calc(100vh-170px)]
			phone-lg:min-h-[calc(100vh-178px)]
			tablet-sm:min-h-[calc(100vh-206px)]
			tablet-lg:min-h-[calc(100vh-214px)]
			desktop-sm:min-h-[calc(100vh-230px)]
			w-full
		"
	>
		<AlertCircleIcon class="size-16 text-red-500 mb-6" />

		<!-- Status Code -->
		<h1 class="text-6xl font-extrabold text-white mb-4 animate-fade-in">
			{status}
		</h1>

		<!-- Title -->
		<h2 class="text-2xl font-semibold text-gray-300 mb-2 animate-fade-in delay-100">
			{status === 404 ? 'Page Not Found' : 'Something went wrong'}
		</h2>

		<!-- Message -->
		<p class="text-gray-400 mb-6 max-w-md animate-fade-in delay-200">
			{message}
		</p>

		<a
			href="/"
			class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
		>
			Back to Home
		</a>
	</div>
</ContentLayout>

<Footer />

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in {
        animation: fade-in 0.4s ease forwards;
        opacity: 0;
    }
    .animate-fade-in.delay-100 {
        animation-delay: 0.1s;
    }
    .animate-fade-in.delay-200 {
        animation-delay: 0.2s;
    }
</style>

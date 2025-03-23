<script lang="ts">
	import { AlertCircleIcon } from 'lucide-svelte';
</script>

<div
	class="
		flex flex-col items-center justify-center
		text-center px-4
		min-h-[calc(100vh-150px)]
		phone-sm:min-h-[calc(100vh-170px)]
		phone-lg:min-h-[calc(100vh-178px)]
		tablet-sm:min-h-[calc(100vh-206px)]
		tablet-lg:min-h-[calc(100vh-214px)]
		desktop-sm:min-h-[calc(100vh-230px)]
		w-full
	"
>
	<AlertCircleIcon class="size-16 text-red-500" />
	<h2 class="text-2xl font-bold mt-4 animate-fade-in">User Not Found</h2>
	<p class="text-gray-400 text-sm mt-2 animate-fade-in delay-100">
		Sorry, we couldn't find the player you're looking for. <br />
		Please check the uid or try searching again.
	</p>
	<a
		href="/"
		class="
			mt-4 px-4 py-2 bg-blue-500 text-white rounded-md
			hover:bg-blue-600 transition
		"
	>
		Back to Home
	</a>
</div>

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
</style>
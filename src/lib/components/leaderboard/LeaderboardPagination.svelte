<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { getPageNumbers, PAGINATION_ELLIPSIS } from '$lib/utils/leaderboard';

	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	}

	let { currentPage, totalPages, onPageChange }: Props = $props();

	const pages = $derived(getPageNumbers(currentPage, totalPages));

	const navButtonClass =
		'flex items-center gap-2 px-4 py-2 rounded-lg ' +
		'bg-[#2A2A2A] hover:bg-[#333333] ' +
		'disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
</script>

<div
	class="bg-[#1A1A1A] px-4 py-4 md:px-6 flex items-center justify-between border-t border-gray-700"
>
	<button
		onclick={() => onPageChange(currentPage - 1)}
		disabled={currentPage === 1}
		class={navButtonClass}
	>
		<ChevronLeft size={20} class="text-white" />
		<span class="text-white font-medium hidden sm:inline">Previous</span>
	</button>

	<div class="flex items-center gap-1 md:gap-2">
		{#each pages as page (page)}
			{#if page === PAGINATION_ELLIPSIS}
				<span class="px-2 text-gray-400">...</span>
			{:else}
				<button
					onclick={() => onPageChange(page)}
					class="size-10 rounded-lg font-medium transition-colors
						{currentPage === page
						? 'bg-pink-600 text-white'
						: 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'}"
				>
					{page}
				</button>
			{/if}
		{/each}
	</div>

	<button
		onclick={() => onPageChange(currentPage + 1)}
		disabled={currentPage === totalPages}
		class={navButtonClass}
	>
		<span class="text-white font-medium hidden sm:inline">Next</span>
		<ChevronRight size={20} class="text-white" />
	</button>
</div>
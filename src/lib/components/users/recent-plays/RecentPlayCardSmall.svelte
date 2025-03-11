<script>
	import { ChevronDownIcon } from 'lucide-svelte';

	let isOpen = $state(false);

	function toggleDetails() {
		isOpen = !isOpen;
	}
</script>

<div
	class="
	recent-play
	card
	border-color rounded-[5px] border-[1px] border-[#E5E5E5]
	bg-[#E5E5E5]
	text-black
	w-full"
>
	<div class="showoff flex px-2.5 py-1 gap-1.5 min-h-[40px]">
		{#if !isOpen}
			<div
				class="
					flex
					size-[30px]
					text-white font-bold text-lg
					bg-[#2A2A2A]
					border-[#3C3C3C] border-[1px] rounded-[5px]
					items-center justify-center
					"
			>
				SS
			</div>
		{/if}

		<div class="text-left">
			<h2 class="text-sm leading-4">Artist - Title</h2>
			<p class="text-xs text-[#505050] italic leading-3.5">Difficulty Name</p>
		</div>

		<button
			onclick={toggleDetails} class="transition-transform duration-300 ml-auto"
			aria-label="Toggle Details"
			style="transform: rotate({isOpen ? '180deg' : '0deg'})"
		>
			<ChevronDownIcon size={25} color="#505050" />
		</button>
	</div>

	{#if isOpen}
		<div
			class="
			details
			flex justify-between items-center
			border-t border-[#2A2A2A] border-dashed
			rounded-b-[4px]
			px-2.5
			min-h-[40px]"
		>
			<div
				class="flex gap-1.5 items-center"
			>
				<div
					class="
					flex
					size-[30px]
					text-white font-bold text-lg
					bg-[#2A2A2A]
					border-[#3C3C3C] border-[1px] rounded-[5px]
					items-center justify-center
					"
				>
					SS
				</div>

				<p class="text-[#505050] text-xs italic">+HDHR</p>
			</div>

			<div
				class="flex flex-col text-right"
			>
				<p class="text-sm italic">30,000,000 / 1111x / 100% / 0 m</p>
				<p class="text-[0.5rem] text-[#505050] italic">1970/01/01 00:00:00</p>
			</div>
		</div>
	{/if}
</div>
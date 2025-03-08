<script>
	import { ChevronDownIcon } from 'lucide-svelte';
	let isOpen = $state(false)

	function toggleDetails() {
		isOpen = !isOpen
	}
</script>

<div
	class="
	top-play
	card
	border-color rounded-[5px] border-[1px] border-[#E5E5E5]
	w-full"
>
	<div class="showoff flex pr-5 min-h-[70px]">
		<div
			class="
			flex counter
			bg-[#E5E5E5]
			w-5 h-5
			rounded-tl-[4px] rounded-br-[5px]
			text-black font-bold
			items-center justify-center"
		>
			<span>1</span>
		</div>
		<div class="flex w-full bg-[#2A2A2A]  items-center">
			{#if !isOpen}
				<div class="text-2xl font-bold size-10">
					SS
				</div>
			{/if}
			<div class="text-left pl-2.5">
				<h2>Title</h2>
				<p class="text-xs italic">Author</p>
				<p class="text-[#E69F00] text-xs italic">Difficulty Name</p>
			</div>
			<button onclick={toggleDetails} class="transition-transform duration-300 ml-auto"
							aria-label="Toggle Details"
							style="transform: rotate({isOpen ? '180deg' : '0deg'})"
			>
				<ChevronDownIcon size={35} />
			</button>

		</div>
	</div>
	{#if isOpen}
		<div class="details text-black bg-[#E5E5E5] rounded-b-[4px]">
			This will hide or not
		</div>
	{/if}
</div>

<script>
	import { ChevronDownIcon } from 'lucide-svelte';

	let isOpen = $state(false);

	function toggleDetails() {
		isOpen = !isOpen;
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
				<p class="leading-3.5 text-xs italic">Author</p>
				<p class="leading-3.5 text-[#E69F00] text-xs italic">Difficulty Name</p>
			</div>

			<button
				onclick={toggleDetails} class="transition-transform duration-300 ml-auto"
				aria-label="Toggle Details"
				style="transform: rotate({isOpen ? '180deg' : '0deg'})"
			>
				<ChevronDownIcon size={35} />
			</button>
		</div>
	</div>

	<div
		class={
			`details
			flex flex-col
			text-black
			bg-[#E5E5E5]
			rounded-b-[4px]
			px-2.5
			py-auto
			justify-center
			${isOpen ? 'min-h-[50px]' : 'min-h-[30px]'}`
		}
	>
		<div class="flex items-center gap-1.5 font-bold">
			{#if isOpen}
				<div
					class="
					flex
					w-14
					h-5
					text-white
					bg-[#2A2A2A]
					border-[#3C3C3C] border-[1px] rounded-[5px]
					items-center justify-center
					"
				>
					SS
				</div>
			{:else}
				<div class="mods flex gap-[1px]">
					<img class="max-w-[24px] h-auto object-contain" src="/modicons/HD.png" alt="hidden mod icon" />
					<img class="max-w-[24px] h-auto object-contain" src="/modicons/HR.png" alt="hard rock mod icon" />
				</div>
			{/if}

			<p>
				100.00%
			</p>

			<p class="ml-auto">1000<span class="text-[#505050]">pp</span></p>
		</div>
		{#if isOpen}
			<div class="flex text-xs italic text-left gap-1.5">
				<div class="mods flex gap-[1px]">
					<img class="max-w-[24px] h-auto object-contain" src="/modicons/HD.png" alt="hidden mod icon" />
					<img class="max-w-[24px] h-auto object-contain" src="/modicons/HR.png" alt="hard rock mod icon" />
				</div>

				<p>30,000,000 / 1300x / 0 miss</p>

				<p class="ml-auto">(1000<span class="text-[#505050]">pp</span>)</p>
			</div>
		{/if}
	</div>
</div>

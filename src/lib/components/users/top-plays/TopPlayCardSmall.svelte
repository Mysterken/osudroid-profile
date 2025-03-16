<script lang="ts">
	import { ChevronDownIcon } from 'lucide-svelte';
	import { playUtils } from '$lib/utils/playUtils';
	import ModIcon from '$lib/components/ui/ModIcon.svelte';
	import LetterRank from '$lib/components/ui/LetterRank.svelte';

	let {
		index,
		filename,
		mods,
		score,
		combo,
		rank,
		miss,
		accuracy,
		pp
	}: {
		index: number;
		filename: string;
		mods: string[];
		score: number;
		combo: number;
		rank: string;
		miss: number;
		accuracy: number;
		pp: number | null;
	} = $props();

	let isOpen = $state(false);

	function toggleDetails() {
		isOpen = !isOpen;
	}

	let formattedScore = score.toLocaleString();
	let formattedCombo = combo.toLocaleString();
	let calculatedAccuracy = (accuracy * 100).toFixed(2);
	let formattedPP = pp?.toFixed(2);
	let rawPP = playUtils.calculateRawPP(pp, index + 1).toFixed(2);

	let { songArtist, songTitle, mapper, difficulty } = playUtils.convertTitleToBeatmapMetadata(filename);
</script>

<div class="top-play card border-color rounded-[5px] border-[1px] border-[#E5E5E5] w-full">
	<div class="showoff flex pr-5 min-h-[70px]">
		<div class="flex counter bg-[#E5E5E5] w-5 h-5 rounded-tl-[4px] rounded-br-[5px] text-black font-bold items-center justify-center">
			<span>{index + 1}</span>
		</div>

		<div class="flex w-full bg-[#2A2A2A] items-center">
			{#if !isOpen}
				<LetterRank sx="text-2xl font-bold size-10" {rank} />
			{/if}

			<div class="text-left pl-2.5">
				<h2>{songTitle}</h2>
				<p class="leading-3.5 text-xs italic">{songArtist}</p>
				<p class="leading-3.5 text-[#E69F00] text-xs italic">{difficulty}</p>
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
				<LetterRank
					sx="
					flex
					w-14
					h-5
					text-white
					bg-[#2A2A2A]
					border-[#3C3C3C] border-[1px] rounded-[5px]
					items-center justify-center"

					{rank}
				/>
			{:else}
				<div class="mods flex gap-[1px]">
					{#each mods as mod (mod)}
						<ModIcon {mod} />
					{/each}
				</div>
			{/if}
			<p>{calculatedAccuracy}%</p>
			<p class="ml-auto">{formattedPP}<span class="text-[#505050]">pp</span></p>
		</div>
		{#if isOpen}
			<div class="flex text-xs italic text-left gap-1.5">
				<div class="mods flex gap-[1px]">
					{#each mods as mod (mod)}
						<ModIcon {mod} />
					{/each}
				</div>
				<p>{formattedScore} / {formattedCombo}x / {miss} miss</p>
				<p class="ml-auto">({rawPP}<span class="text-[#505050]">pp</span>)</p>
			</div>
		{/if}
	</div>
</div>
<script lang="ts">
	import { ChevronDownIcon } from 'lucide-svelte';
	import { playUtils } from '$lib/utils/playUtils';
	import LetterRank from '$lib/components/ui/LetterRank.svelte';

	let {
		filename,
		mods,
		score,
		combo,
		rank,
		miss,
		accuracy,
		// pp,
		date
	}: {
		filename: string;
		mods: string[];
		score: number;
		combo: number;
		rank: string;
		miss: number;
		accuracy: number;
		// pp: number | null;
		date: string | null;
	} = $props();

	let isOpen = $state(false);

	function toggleDetails() {
		isOpen = !isOpen;
	}

	let formattedScore = score.toLocaleString();
	let formattedCombo = combo.toLocaleString();
	let calculatedAccuracy = (accuracy * 100).toFixed(2);
	let formattedDate = date ? new Date(date).toLocaleString() : '';

	let {
		songArtist,
		songTitle,
		mapper,
		difficulty
	} = playUtils.convertTitleToBeatmapMetadata(filename.replaceAll('_', ' '));
</script>

<div
	class="
	recent-play
	card
	rounded-[5px]
	bg-[#E5E5E5]
	text-black
	w-full"
>
	<div class="showoff flex px-2.5 py-1 gap-1.5 min-h-[40px]">
		{#if !isOpen}
			<LetterRank
				sx="
				flex
				size-[30px]
				min-w-[30px]
				my-auto
				text-white font-bold text-lg
				bg-[#2A2A2A]
				border-[#3C3C3C] border-[1px] rounded-[5px]
				items-center justify-center"
				{rank}
			/>
		{/if}

		<div class="text-left">
			<h2 class="text-sm leading-4">{songArtist} - {songTitle}</h2>
			<p class="text-xs text-[#505050] italic leading-3.5">{difficulty}</p>
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
				<LetterRank
					sx="
					flex
					size-[30px]
					text-white font-bold text-lg
					bg-[#2A2A2A]
					border-[#3C3C3C] border-[1px] rounded-[5px]
					items-center justify-center"
					{rank}
				/>

				<p class="text-[#505050] text-xs italic">{mods.length ? `+${mods.join('')}` : 'NM'}</p>
			</div>

			<div
				class="flex flex-col text-right"
			>
				<p class="text-sm italic">{formattedScore} / {formattedCombo}x / {calculatedAccuracy}% / {miss} m</p>
				<p class="text-[0.5rem] text-[#505050] italic">{formattedDate}</p>
			</div>
		</div>
	{/if}
</div>
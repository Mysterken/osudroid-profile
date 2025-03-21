<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { playUtils } from '$lib/utils/playUtils';
	import LetterRank from '$lib/components/ui/LetterRank.svelte';
	import ModIcon from '$lib/components/ui/ModIcon.svelte';

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
	flex items-center
	border-color rounded-[5px]
	bg-[#E5E5E5] hover:bg-[#d5d5d5]
	text-black
	min-h-[80px]
	px-4 py-2 gap-5
	w-full
	transition-transform transform hover:scale-[1.01] hover:opacity-90 duration-200"
>

	<LetterRank
		sx="
		flex
		size-[50px]
		text-white font-bold text-lg
		bg-[#2A2A2A]
		border-[#3C3C3C] border-[1px] rounded-[5px]
		items-center justify-center"
		{rank}
	/>

	<div class="text-left">
		<h2 class="text-base leading-4">{songArtist} - {songTitle}</h2>
		<p class="text-[#505050] text-sm italic leading-3.5">{difficulty}</p>
		<div class="mods flex gap-[1px]">
			{#each mods as mod, i (i)}
				<ModIcon size={28} {mod} />
			{/each}
		</div>
	</div>

	<div class="text-right ml-auto min-w-max">
		<h2 class="text-base font-bold leading-3.5">{calculatedAccuracy}%</h2>
		<p class="text-sm italic">{formattedScore} / {formattedCombo}x / {miss} miss</p>
		<p class="text-[#505050] text-xs leading-3" use:tooltip={{text: date}}>{formattedDate}</p>
	</div>
</div>
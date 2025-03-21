<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { playUtils } from '$lib/utils/playUtils';
	import ModIcon from '$lib/components/ui/ModIcon.svelte';
	import LetterRank from '$lib/components/ui/LetterRank.svelte';
	import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';

	let {
		index,
		filename,
		mods,
		score,
		combo,
		rank,
		miss,
		accuracy,
		pp,
		beatmap
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
		beatmap: BeatmapExtended | null;
	} = $props();

	let formattedScore = score.toLocaleString();
	let formattedCombo = combo.toLocaleString();
	let calculatedAccuracy = (accuracy * 100).toFixed(2);
	let formattedPP = pp ? Math.round(pp) : 0;
	let rawPP = Math.round(playUtils.calculateRawPP(pp, index + 1));

	let { songArtist, songTitle, mapper, difficulty } = playUtils.convertTitleToBeatmapMetadata(filename);

	let backgroundImg = beatmap?.beatmapset?.covers?.cover ?
		`linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${beatmap.beatmapset.covers.cover})` :
		'url(/backgrounds/black_cube_pattern.webp)';
</script>

<div
	class="
	top-play
	flex
	card
	border-color rounded-[5px] border-[1px] border-[#E5E5E5]
	w-full h-[120px]
	transition-transform transform hover:scale-[1.01] hover:opacity-95 duration-200"
	style="background-image: {backgroundImg}; background-size: cover; background-position: center;"
>
	<div
		class="
			flex counter
			bg-[#E5E5E5]
			size-9
			min-w-9
			rounded-tl-[4px] rounded-br-[5px]
			text-black text-xl font-bold
			items-center justify-center"
	>
		<span>{index + 1}</span>
	</div>

	<div class="flex flex-grow items-center justify-center gap-2.5 mx-5">
		<LetterRank sx="text-5xl font-bold min-w-[60px]" {rank} />

		<div class="text-left pl-2.5" style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">
			<div class="flex h-14 items-center">
				<h2 class="text-xl">{songTitle}</h2>
			</div>

			<div class="mt-1">
				<p class="leading-4 text-sm italic">{songArtist}</p>
				<p class="leading-3 text-[#E69F00] text-sm italic">{difficulty}</p>
			</div>

			<div>
				<p class="text-sm">{formattedScore} / {formattedCombo}x / {miss} miss</p>
			</div>
		</div>

		<div class="flex flex-col text-right h-full items-center justify-center py-2.5 ml-auto">
			<p class="absolute text-xl font-bold self-end">{calculatedAccuracy}%</p>

			<div class="flex gap-[1px] mt-auto">
				{#each mods as mod (mod)}
					<ModIcon size={42} length={mods.length} {mod} />
				{/each}
			</div>
		</div>
	</div>

	<div
		class="relative flex flex-col justify-center p-2.5 ml-auto min-w-[120px] bg-[#000000]/[.40] rounded-tr-[5px] rounded-br-[5px]">
		<p class="absolute left-1/2 -translate-x-1/2 text-xl font-bold" use:tooltip={{text: pp?.toFixed(2) + 'pp'}}>
			{formattedPP}<span class="text-[#A7A3A3]">pp</span>
		</p>
		<p class="mt-auto self-end" use:tooltip={{text: playUtils.calculateRawPP(pp, index + 1).toFixed(2) + 'pp'}}>
			({rawPP}<span class="text-[#A7A3A3]">pp</span>)
		</p>
	</div>
</div>
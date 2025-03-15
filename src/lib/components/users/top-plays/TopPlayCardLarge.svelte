<script lang="ts">
	import { playUtils } from '$lib/utils/playUtils';

	let {
		index,
		filename,
		// mods,
		score,
		combo,
		rank,
		miss,
		accuracy,
		pp
	}: {
		index: number;
		filename: string;
		score: number;
		combo: number;
		rank: string;
		miss: number;
		accuracy: number;
		pp: number | null;
	} = $props();

	let formattedScore = score.toLocaleString();
	let formattedCombo = combo.toLocaleString();
	let calculatedAccuracy = (accuracy * 100).toFixed(2);
	let formattedPP = pp?.toFixed(2);
	let rawPP = playUtils.calculateRawPP(pp, index + 1).toFixed(2);

	let { songArtist, songTitle, mapper, difficulty } = playUtils.convertTitleToBeatmapMetadata(filename);
</script>

<div
	class="
	top-play
	flex
	card
	border-color rounded-[5px] border-[1px] border-[#E5E5E5]
	w-full h-[120px]"
>
	<div
		class="
			flex counter
			bg-[#E5E5E5]
			w-8 h-8
			rounded-tl-[4px] rounded-br-[5px]
			text-black text-xl font-bold
			items-center justify-center"
	>
		<span>{index + 1}</span>
	</div>

	<div class="flex w-full items-center justify-center gap-2.5 mx-5">
		<div class="text-5xl font-bold">
			{rank}
		</div>

		<div class="text-left">
			<div class="flex h-14 items-center">
				<h2 class="text-2xl">{songTitle}</h2>
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
				<img class="max-w-[42px] h-auto object-contain" src="/modicons/HD.png" alt="hidden mod icon" />
				<img class="max-w-[42px] h-auto object-contain" src="/modicons/HR.png" alt="hard rock mod icon" />
			</div>
		</div>
	</div>

	<div
		class="relative flex flex-col justify-center p-2.5 ml-auto w-[160px] bg-[#000000]/[.40] rounded-tr-[5px] rounded-br-[5px]">
		<p class="absolute left-1/2 -translate-x-1/2 text-xl font-bold">{formattedPP}<span class="text-[#A7A3A3]">pp</span></p>
		<p class="mt-auto self-end">({rawPP}<span class="text-[#A7A3A3]">pp</span>)</p>
	</div>
</div>
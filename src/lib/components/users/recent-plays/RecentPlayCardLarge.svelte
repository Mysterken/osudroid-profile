<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { playUtils } from '$lib/utils/playUtils';
	import LetterRank from '$lib/components/ui/LetterRank.svelte';
	import ModIcon from '$lib/components/ui/ModIcon.svelte';
	import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';

	let {
		filename,
		hash,
		mods,
		score,
		combo,
		rank,
		miss,
		accuracy,
		date,
		openModal,
		beatmaps
	}: {
		filename: string;
		hash?: string;
		mods: string[];
		score: number;
		combo: number;
		rank: string;
		miss: number;
		accuracy: number;
		date: string | null;
		openModal: (beatmap: BeatmapExtended | null | undefined) => void;
		beatmaps: Map<string, BeatmapExtended | null>;
	} = $props();

	let formattedScore = score.toLocaleString();
	let formattedCombo = combo.toLocaleString();
	let calculatedAccuracy = (accuracy * 100).toFixed(2);
	let formattedDate = date ? new Date(date).toLocaleString() : '';

	let { songArtist, songTitle, difficulty } = playUtils.convertTitleToBeatmapMetadata(filename.replaceAll('_', ' '));

	let beatmap: BeatmapExtended | null | undefined = $state(beatmaps.get(hash ?? filename));

	function loadBeatmapModal() {
		beatmap = beatmaps.get(hash ?? filename);
		openModal(beatmap);

		if (beatmap === undefined) {
			getBeatmap(filename, hash).then((data) => {
				beatmap = data;
				openModal(beatmap);
			});
		}
	}

	async function getBeatmap(filename?: string, hash?: string) {
		const response = await fetch('/api/beatmaps', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ lookups: [{ filename, hash }] })
		});

		if (!response.ok) return null;

		const data = await response.json();
		const beatmap = data.length > 0 ? data[0].beatmap : null;

		beatmaps.set(data[0]?.key ?? '', beatmap);

		return beatmap;
	}
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
		{rank}
		sx="
		flex
		size-[50px]
		min-w-[50px]
		text-white font-bold text-lg
		bg-[#2A2A2A]
		border-[#3C3C3C] border-[1px] rounded-[5px]
		items-center justify-center"
	/>

	<div class="text-left flex-grow"
			 onclick={() => loadBeatmapModal()}
			 onkeydown={(e) => (e.key === 'Enter') && loadBeatmapModal()} role="button"
			 tabindex="0"
	>
		<h2 class="text-base leading-4">{songArtist} - {songTitle}</h2>
		<p class="text-[#505050] text-sm italic leading-3.5">{difficulty}</p>
		<div class="mods flex gap-[1px]">
			{#each mods as mod, i (i)}
				<ModIcon size={28} length={mods.length} {mod} />
			{/each}
		</div>
	</div>

	<div class="text-right ml-auto min-w-max">
		<h2 class="text-base font-bold leading-3.5">{calculatedAccuracy}%</h2>
		<p class="text-sm italic">{formattedScore} / {formattedCombo}x / {miss} miss</p>
		<p class="text-[#505050] text-xs leading-3" use:tooltip={{text: date}}>{formattedDate}</p>
	</div>
</div>
<script lang="ts">
	import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';
	import { ExternalLinkIcon, PlayIcon, SquareIcon } from 'lucide-svelte';
	import { playUtils } from '$lib/utils/playUtils.js';

	let { dialog = $bindable(), beatmap }: { dialog?: HTMLDialogElement, beatmap?: BeatmapExtended | null } = $props();
	let audio: HTMLAudioElement | null = null;
	let isPlaying = $state(false);
	let isDialogVisible = $state(false);

	let bpm = $state(0);
	let maxCombo = $state(0);

	// fix type error
	$effect(() => {
		if (beatmap) {
			bpm = beatmap.bpm ?? 0;
			maxCombo = beatmap.max_combo ?? 0;
		}
	});

	$effect(() => {
		if (dialog) {
			dialog.addEventListener('toggle', () => {
				isDialogVisible = dialog?.open ?? false;
				document.body.style.overflow = dialog?.open ? 'hidden' : '';
			});

			dialog.addEventListener('close', () => {
				isDialogVisible = false;
				document.body.style.overflow = '';
				stopPreview();
			});

			dialog.addEventListener('click', (event) => {
				if (event.target instanceof Node && !dialog?.querySelector('.modal-content')?.contains(event.target)) {
					dialog?.close();
				}
			});
		}
	});

	function playPreview() {
		if (!beatmap?.beatmapset?.preview_url) return;

		if (!audio) {
			audio = new Audio(beatmap.beatmapset.preview_url);
			audio.addEventListener('ended', () => isPlaying = false);
		}

		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	function stopPreview() {
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
			isPlaying = false;
			audio = null;
		}
	}
</script>

{#snippet metadata()}
	<h1 class="text-base font-bold">{beatmap?.beatmapset?.title}</h1>
	<h2 class="text-sm text-gray-500">{beatmap?.beatmapset?.artist}</h2>

	<h2 class="text-sm">{beatmap?.version}</h2>

	<div class="flex gap-5 mt-2.5 text-xs">
		<p>Star Rating: {beatmap?.difficulty_rating}</p>
		<p>Length: {playUtils.formatLength(beatmap?.total_length)}</p>
	</div>

	<p class="text-xs text-gray-500 mt-2.5">Mapped by {beatmap?.beatmapset?.creator}</p>
{/snippet}

{#snippet beatmapTable(title = '', stats = [{ id: 'id', label: 'label', value: 0 }])}
	<h3 class="font-semibold mb-1 text-left">{title}</h3>

	<table class="w-full text-left text-xs text-gray-300">
		<tbody>
		{#each stats as stat (stat.id)}
			<tr>
				<td class="pr-2">{stat.label}</td>
				<td class="text-white font-bold">{stat.value}</td>
			</tr>
		{/each}
		</tbody>
	</table>
{/snippet}

<dialog
	bind:this={dialog}
	class="
		modal
		rounded-xl
		shadow-lg
		max-w-md w-full
		backdrop:bg-black/50
		top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
	"
>
	<div
		class="
		modal-content
	bg-[#1E1E1E]
		text-white
		p-6"
	>
		{#if beatmap === undefined}
			<p class="text-sm text-gray-400">Beatmap is loading...</p>
		{:else if beatmap === null}
			<p class="text-sm text-red-400">This beatmap could not be found.</p>
		{:else if beatmap}
			<div class="flex text-left">
				<div>
					{#if isDialogVisible}
						<img
							src={beatmap?.beatmapset?.covers.list}
							alt="Beatmap Cover"
							class="w-[100px] h-[100px] rounded-[5px] bg-white"
						/>
					{/if}

					<button type="button" class="bg-[#3C4345] text-sm font-bold btn preset-filled w-[100px] mt-2.5 p-1"
									onclick={playPreview}>
						{#if isPlaying}
							<SquareIcon class="invert" fill="" size={18} />
						{:else}
							<PlayIcon class="invert" fill="" size={18} />
						{/if}
					</button>
				</div>

				<div class="ml-2.5">
					{@render metadata()}
				</div>
			</div>
			<div class="mt-4 w-full text-sm grid grid-cols-2 gap-6 px-2.5">
				<div>
					{@render beatmapTable('Difficulty', [
						{ id: 'cs', label: 'CS', value: beatmap.cs },
						{ id: 'hp', label: 'HP', value: beatmap.drain },
						{ id: 'od', label: 'OD', value: beatmap.accuracy },
						{ id: 'ar', label: 'AR', value: beatmap.ar }
					])}
				</div>

				<div>
					{@render beatmapTable('Statistics', [
						{ id: 'bpm', label: 'BPM', value: bpm },
						{ id: 'circles', label: 'Circles', value: beatmap.count_circles },
						{ id: 'sliders', label: 'Sliders', value: beatmap.count_sliders },
						{ id: 'max_combo', label: 'Max Combo', value: maxCombo }
					])}
				</div>
			</div>

			<a href={beatmap.url} target="_blank">
				<button type="button" class="btn preset-filled-primary-500 mt-6 w-full">
					View on osu!
					<ExternalLinkIcon size={16} />
				</button>
			</a>
		{:else}
			<p class="text-sm text-red-400">Beatmap is not available.</p>
		{/if}
	</div>
</dialog>

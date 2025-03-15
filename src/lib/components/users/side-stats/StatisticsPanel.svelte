<script lang="ts">
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { ChartPieIcon } from 'lucide-svelte';

	let {
		source,
		performancePoints,
		score,
		accuracy,
		playcount
	}: {
		source: 'api' | 'scraper';
		performancePoints: number;
		score: number;
		accuracy: number;
		playcount: number;
	} = $props();

	let calculatedAccuracy = source === 'api' ? (accuracy * 100).toFixed(2) : accuracy;
	let formattedScore = score.toLocaleString();
	let formattedPlaycount = playcount.toLocaleString();

	let stats = [
		{ name: 'Performance Points', value: performancePoints, id: 'pp' },
		{ name: 'Score', value: formattedScore, id: 'score' },
		{ name: 'Hit Accuracy', value: `${calculatedAccuracy}%`, id: 'accuracy' },
		{ name: 'Play Count', value: formattedPlaycount, id: 'playcount' }
	];
</script>

{#snippet userStats()}
	<table class="w-full text-sm max-w-[400px]">
		<tbody>
		{#each stats as stat (stat.id)}
			<tr>
				<td class="pb-1 text-left">{stat.name}</td>
				<td class="pb-1 text-right font-bold">{stat.value}</td>
			</tr>
		{/each}
		</tbody>
	</table>
{/snippet}

<ContentCard sx="!p-2.5 flex flex-col gap-2.5">
	<div class="flex items-center gap-3.5">
		<ChartPieIcon class="size-8" />
		<h1 class="font-bold text-lg">Statistics</h1>
	</div>
	<div class="user-stats flex flex-col justify-center w-full px-2">
		{@render userStats()}
	</div>
</ContentCard>
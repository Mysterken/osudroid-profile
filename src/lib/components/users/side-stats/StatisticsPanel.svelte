<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { ChartPieIcon } from 'lucide-svelte';

	let {
		source,
		performancePoints,
		score,
		accuracy,
		playcount
	}: {
		source: 'api' | 'scraper' | 'merged';
		performancePoints: number;
		score: number;
		accuracy: number;
		playcount: number;
	} = $props();

	let formattedPerformancePoints = $derived(Math.round(performancePoints));
	let calculatedAccuracy = $derived(
		source === 'api' || source === 'merged' ? (accuracy * 100).toFixed(2) : accuracy
	);
	let formattedScore = $derived(score.toLocaleString());
	let formattedPlaycount = $derived(playcount.toLocaleString());

	let stats = $derived([
		{
			name: 'Performance Points',
			value: formattedPerformancePoints,
			id: 'pp',
			info: performancePoints
		},
		{ name: 'Score', value: formattedScore, id: 'score' },
		{ name: 'Hit Accuracy', value: `${calculatedAccuracy}%`, id: 'accuracy' },
		{ name: 'Play Count', value: formattedPlaycount, id: 'playcount' }
	]);
</script>

{#snippet userStats()}
	<div class="space-y-1">
		{#each stats as stat (stat.id)}
			<div class="flex justify-between items-center">
				<span class="text-left whitespace-nowrap">{stat.name}</span>
				<span class="text-right font-bold truncate" use:tooltip={{ text: String(stat.info ?? '') }}
					>{stat.value}</span
				>
			</div>
		{/each}
	</div>
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

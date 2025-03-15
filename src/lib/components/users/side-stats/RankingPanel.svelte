<script lang="ts">
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';

	let {
		source,
		globalRanking,
		countryRanking,
		scoreRanking,
		ppRanking
	}: {
		source: 'api' | 'scraper';
		globalRanking: number | null;
		countryRanking: number | null;
		scoreRanking: number | null;
		ppRanking: number | null;
	} = $props();
</script>

<ContentCard sx="!p-2.5 flex flex-col gap-2.5">
	<div class="flex items-center gap-3.5">
		<img class="size-8 filter invert" src="/icons/leaderboard-rounded.svg" alt="leaderboard icon" />
		<h1 class="font-bold text-lg">Ranking</h1>
	</div>

	<div class="user-ranking flex flex-col justify-center w-full px-2">
		<table class="w-full text-sm max-w-[400px]">
			<tbody>
			<tr>
				<td class="pb-1 text-left">{source === 'api' ? 'Global Ranking' : 'Score Ranking'}</td>
				<td class="pb-1 text-right font-bold">#{source === 'api' ? globalRanking : scoreRanking}</td>
			</tr>
			<tr>
				<td class="pb-1 text-left">{source === 'api' ? 'Country Ranking' : 'PP Ranking'}</td>
				<td class="pb-1 text-right font-bold">#{source === 'api' ? countryRanking : ppRanking}</td>
			</tr>
			</tbody>
		</table>
	</div>
</ContentCard>
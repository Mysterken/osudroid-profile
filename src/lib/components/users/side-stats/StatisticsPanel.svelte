<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { ChartPieIcon } from 'lucide-svelte';
</script>

<ContentCard
	sx="!p-2.5 flex flex-col gap-2.5"
>
	<div
		class="
			flex items-center gap-3.5"
	>
		<ChartPieIcon class="size-8" />
		<h1 class="font-bold text-lg">Statistics</h1>
	</div>

	<div class="user-stats flex flex-col justify-center w-full px-2">
		<table class="w-full text-sm max-w-[400px]">
			<tbody>
			<tr>
				<td class="pb-1 text-left">Performance Points</td>
				<td class="pb-1 text-right font-bold">6000</td>
			</tr>
			<tr>
				<td class="pb-1 text-left">Score</td>
				<td class="pb-1 text-right font-bold">17,183,008,068</td>
			</tr>
			<tr>
				<td class="pb-1 text-left">Hit Accuracy</td>
				<td class="pb-1 text-right font-bold">99.29%</td>
			</tr>
			<tr>
				<td class="pb-1 text-left">Play Count</td>
				<td class="pb-1 text-right font-bold">1213</td>
			</tr>
			</tbody>
		</table>
	</div>
</ContentCard>
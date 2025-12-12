<script lang="ts">
	import leaderboardRoundedIcon from '$lib/assets/icons/leaderboard-rounded.svg';
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
</script>

<ContentCard sx="!p-2.5 flex flex-col gap-2.5">
	<div class="flex items-center gap-3.5">
		<img class="size-8 filter invert" src={leaderboardRoundedIcon} alt="leaderboard icon" />
		<h1 class="font-bold text-lg">Ranking</h1>
	</div>

	<div class="user-ranking flex flex-col justify-center w-full px-2">
		<table class="w-full text-sm max-w-100">
			<tbody>
				<tr>
					<td class="pb-1 text-left">Global Ranking</td>
					<td class="pb-1 text-right font-bold h-full">
						<div class="placeholder animate-pulse w-16 h-2 ml-auto"></div>
					</td>
				</tr>
				<tr>
					<td class="pb-1 text-left">Country Ranking</td>
					<td class=" pb-1 text-right font-bold">
						<div class="placeholder animate-pulse w-14 h-2 ml-auto"></div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</ContentCard>

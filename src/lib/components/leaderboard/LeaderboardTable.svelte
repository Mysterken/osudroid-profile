<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import type { LeaderboardPlayer } from '$lib/services/leaderboardService';
	import { computeRank } from '$lib/utils/leaderboard';
	import LeaderboardRow from './LeaderboardRow.svelte';
	import LeaderboardCard from './LeaderboardCard.svelte';
	import LeaderboardPagination from './LeaderboardPagination.svelte';

	interface Props {
		players: LeaderboardPlayer[];
		rankingType: 'pp' | 'score';
		isLoading: boolean;
		currentPage: number;
		totalPages: number;
		playersPerPage: number;
		totalCount: number;
		onPageChange: (page: number) => void;
	}

	let {
		players,
		rankingType,
		isLoading,
		currentPage,
		totalPages,
		playersPerPage,
		totalCount,
		onPageChange
	}: Props = $props();

	const hasPlayers = $derived(!isLoading && players.length > 0);
</script>

{#snippet loadingIndicator(label: string)}
	<div class="flex items-center justify-center gap-3 py-16">
		<LoaderCircle size={24} class="animate-spin text-pink-600" />
		<span class="text-gray-400">{label}</span>
	</div>
{/snippet}

<div class="bg-[#2A2A2A] rounded-2xl overflow-hidden">
	<!-- Desktop -->
	<div class="hidden md:block overflow-x-auto">
		<table class="w-full">
			<thead class="bg-[#1A1A1A] border-b border-gray-700">
			<tr>
				<th class="px-6 py-4 text-left text-sm font-semibold text-gray-400 w-20">Rank</th>
				<th class="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
				<th class="px-6 py-4 text-right text-sm font-semibold text-gray-400">
					{rankingType === 'score' ? 'Score' : 'Performance'}
				</th>
				<th class="px-6 py-4 text-right text-sm font-semibold text-gray-400">Accuracy</th>
				<th class="px-6 py-4 text-right text-sm font-semibold text-gray-400">Playcount</th>
			</tr>
			</thead>
			<tbody>
			{#if isLoading}
				<tr>
					<td colspan="5" class="px-6 py-16 text-center">
						{@render loadingIndicator('Loading leaderboard...')}
					</td>
				</tr>
			{:else if players.length === 0}
				<tr>
					<td colspan="5" class="px-6 py-16 text-center text-gray-400">No players found</td>
				</tr>
			{:else}
				{#each players as player, i (player.userId)}
					<LeaderboardRow
						{player}
						{rankingType}
						rank={computeRank(currentPage, playersPerPage, i)}
					/>
				{/each}
			{/if}
			</tbody>
		</table>
	</div>

	<!-- Mobile -->
	<div class="md:hidden">
		{#if isLoading}
			{@render loadingIndicator('Loading...')}
		{:else if players.length === 0}
			<div class="py-16 text-center text-gray-400">No players found</div>
		{:else}
			{#each players as player, i (player.userId)}
				<LeaderboardCard
					{player}
					{rankingType}
					rank={computeRank(currentPage, playersPerPage, i)}
				/>
			{/each}
		{/if}
	</div>

	{#if hasPlayers}
		<LeaderboardPagination
			{currentPage}
			{totalPages}
			{playersPerPage}
			{totalCount}
			{onPageChange}
		/>
	{/if}
</div>
<script lang="ts">
	import { resolve } from '$app/paths';
	import defaultAvatarImg from '$lib/assets/default/avatar.webp';
	import type { LeaderboardPlayer } from '$lib/services/leaderboardService';
	import {
		formatNumber,
		getPlayerAvatarUrl,
		getRankColor,
		getRankIcon
	} from '$lib/utils/leaderboard';

	interface Props {
		player: LeaderboardPlayer;
		rank: number;
		rankingType: 'pp' | 'score';
	}

	let { player, rank, rankingType }: Props = $props();

	const rankColor = $derived(getRankColor(rank));
	const RankIcon = $derived(getRankIcon(rank));
	const primaryValue = $derived(
		rankingType === 'score' ? player.score ?? 0 : player.pp ?? 0
	);

	function handleAvatarError(event: Event) {
		(event.target as HTMLImageElement).src = defaultAvatarImg;
	}
</script>

<tr class="border-b border-gray-800 hover:bg-[#333333] transition-colors">
	<td class="px-6 py-4">
		<div class="flex items-center gap-2">
			{#if RankIcon}
				<RankIcon size={20} class={rankColor} />
			{/if}
			<span class="text-white font-semibold {rankColor}">#{rank}</span>
		</div>
	</td>
	<td class="px-6 py-3">
		<a
			href={resolve(`/users/${player.userId}`)}
			class="flex items-center gap-3 hover:opacity-80 transition-opacity"
		>
			<img
				src={getPlayerAvatarUrl(player.userId)}
				alt={player.username}
				class="size-10 rounded-full bg-gray-700"
				onerror={handleAvatarError}
			/>
			<div class="flex items-center gap-2">
				<p class="text-sm text-gray-400">
					<span class="rounded-xs fi fi-{player.country.toLowerCase()}"></span>
				</p>
				<span class="text-white font-medium">{player.username}</span>
			</div>
		</a>
	</td>
	<td class="px-6 py-4 text-right">
		<span class="text-white font-semibold">{formatNumber(primaryValue)}</span>
		{#if rankingType !== 'score'}
			<span class="text-gray-400 text-sm ml-1">pp</span>
		{/if}
	</td>
	<td class="px-6 py-4 text-right">
		<span class="text-white">{player.accuracy.toFixed(2)}%</span>
	</td>
	<td class="px-6 py-4 text-right text-gray-400">
		{formatNumber(player.playcount)}
	</td>
</tr>
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

	let isAvatarLoading = $state(true);

	const rankColor = $derived(getRankColor(rank));
	const RankIcon = $derived(getRankIcon(rank));
	const primaryValue = $derived(
		rankingType === 'score' ? player.score ?? 0 : player.pp ?? 0
	);

	function handleAvatarLoad() {
		isAvatarLoading = false;
	}

	function handleAvatarError(event: Event) {
		isAvatarLoading = false;
		(event.target as HTMLImageElement).src = defaultAvatarImg;
	}
</script>

<a
	href={resolve(`/users/${player.userId}`)}
	class="block border-b border-gray-800 p-4 hover:bg-[#333333] transition-colors"
>
	<div class="flex items-center gap-3">
		<div class="flex items-center gap-1 w-12">
			{#if RankIcon}
				<RankIcon size={16} class={rankColor} />
			{/if}
			<span class="text-sm font-semibold {rankColor}">#{rank}</span>
		</div>

		<div class="relative size-12">
			{#if isAvatarLoading}
				<div class="absolute inset-0 rounded-full bg-gray-700 animate-pulse"></div>
			{/if}
			<img
				src={getPlayerAvatarUrl(player.userId)}
				alt={player.username}
				class="size-12 rounded-full bg-gray-700 {isAvatarLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300"
				onload={handleAvatarLoad}
				onerror={handleAvatarError}
			/>
		</div>

		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2 mb-1">
				<p class="text-sm text-gray-400">
					<span class="rounded-xs fi fi-{player.country.toLowerCase()}"></span>
				</p>
				<span class="text-white font-medium truncate">{player.username}</span>
			</div>
			<div class="flex items-center gap-3 text-xs text-gray-400">
				<span>
					{formatNumber(primaryValue)}
					{rankingType === 'score' ? 'score' : 'pp'}
				</span>
				<span>{player.accuracy.toFixed(2)}%</span>
				<span>{formatNumber(player.playcount)} plays</span>
			</div>
		</div>
	</div>
</a>
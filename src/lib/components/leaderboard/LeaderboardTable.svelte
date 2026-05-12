<script lang="ts">
	import { ChevronLeft, ChevronRight, LoaderCircle, Medal } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import defaultAvatarImg from '$lib/assets/default/avatar.webp';

	export interface LeaderboardPlayer {
		userId: number;
		username: string;
		score?: number;
		pp?: number;
		playcount: number;
		accuracy: number;
		country: string;
	}

	interface Props {
		players: LeaderboardPlayer[];
		rankingType: 'pp' | 'score';
		isLoading: boolean;
		currentPage: number;
		totalPages: number;
		playersPerPage: number;
		onPageChange: (page: number) => void;
	}

	let { players, rankingType, isLoading, currentPage, totalPages, playersPerPage, onPageChange }: Props = $props();

	function getRankColor(rank: number): string {
		if (rank === 1) return 'text-yellow-400';
		if (rank === 2) return 'text-gray-300';
		if (rank === 3) return 'text-amber-600';
		return 'text-gray-400';
	}

	function getRankIcon(rank: number) {
		if (rank <= 3) return Medal;
		return null;
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(Math.round(num));
	}

	function getPageNumbers(): (number | string)[] {
		const pages: (number | string)[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		// Always show first page
		pages.push(1);

		if (currentPage > 3) {
			pages.push('...');
		}

		// Show pages around current
		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) {
			pages.push('...');
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	}

	function defaultAvatar(event: Event) {
		(event.target as HTMLInputElement).src = defaultAvatarImg;
	}
</script>

<div class="bg-[#2A2A2A] rounded-2xl overflow-hidden">

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
						<div class="flex items-center justify-center gap-3">
							<LoaderCircle size={24} class="animate-spin text-pink-600" />
							<span class="text-gray-400">Loading leaderboard...</span>
						</div>
					</td>
				</tr>
			{:else if players.length === 0}
				<tr>
					<td colspan="5" class="px-6 py-16 text-center text-gray-400">
						No players found
					</td>
				</tr>
			{:else}
				{#each players as player, i (player.userId)}
					{@const rank = (currentPage - 1) * playersPerPage + i + 1}
					<tr class="border-b border-gray-800 hover:bg-[#333333] transition-colors">
						<td class="px-6 py-4">
							<div class="flex items-center gap-2">
								{#if getRankIcon(rank)}
									{@const Icon = getRankIcon(rank)}
									<Icon size={20} class={getRankColor(rank)} />
								{/if}
								<span class="text-white font-semibold {getRankColor(rank)}">
										#{rank}
									</span>
							</div>
						</td>
						<td class="px-6 py-3">
							<a
								href={resolve(`/users/${player.userId}`)}
								class="flex items-center gap-3 hover:opacity-80 transition-opacity"
							>
								<img
									src="https://osudroid.moe/user/avatar/{player.userId}.png"
									alt={player.username}
									class="size-10 rounded-full bg-gray-700"
									onerror={defaultAvatar}
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
							<span class="text-white font-semibold">
								{rankingType === 'score' ? formatNumber(player.score ?? 0) : formatNumber(player.pp ?? 0)}
							</span>
							<span class="text-gray-400 text-sm ml-1">
								{rankingType === 'score' ? '' : 'pp'}
							</span>
						</td>
						<td class="px-6 py-4 text-right">
							<span class="text-white">{player.accuracy.toFixed(2)}%</span>
						</td>
						<td class="px-6 py-4 text-right text-gray-400">
							{formatNumber(player.playcount)}
						</td>
					</tr>
				{/each}
			{/if}
			</tbody>
		</table>
	</div>

	<div class="md:hidden">
		{#if isLoading}
			<div class="flex items-center justify-center gap-3 py-16">
				<LoaderCircle size={24} class="animate-spin text-pink-600" />
				<span class="text-gray-400">Loading...</span>
			</div>
		{:else if players.length === 0}
			<div class="py-16 text-center text-gray-400">
				No players found
			</div>
		{:else}
			{#each players as player, i (player.userId)}
				{@const rank = (currentPage - 1) * playersPerPage + i + 1}
				<a
					href={resolve(`/users/${player.userId}`)}
					class="block border-b border-gray-800 p-4 hover:bg-[#333333] transition-colors"
				>
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-1 w-12">
							{#if getRankIcon(rank)}
								{@const Icon = getRankIcon(rank)}
								<Icon size={16} class={getRankColor(rank)} />
							{/if}
							<span class="text-sm font-semibold {getRankColor(rank)}">
								#{rank}
							</span>
						</div>

						<img
							src="https://osudroid.moe/user/avatar/{player.userId}.png"
							alt={player.username}
							class="size-12 rounded-full bg-gray-700"
							onerror={defaultAvatar}
						/>

						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<p class="text-sm text-gray-400">
									<span class="rounded-xs fi fi-{player.country.toLowerCase()}"></span>
								</p>
								<span class="text-white font-medium truncate">{player.username}</span>
							</div>
							<div class="flex items-center gap-3 text-xs text-gray-400">
								<span>
									{rankingType === 'score' ? formatNumber(player.score ?? 0) : formatNumber(player.pp ?? 0)}
									{rankingType === 'score' ? 'score' : 'pp'}
								</span>
								<span>{player.accuracy.toFixed(2)}%</span>
								<span>{formatNumber(player.playcount)} plays</span>
							</div>
						</div>
					</div>
				</a>
			{/each}
		{/if}
	</div>

	{#if !isLoading && players.length > 0}
		<div class="bg-[#1A1A1A] px-4 py-4 md:px-6 flex items-center justify-between border-t border-gray-700">
			<button
				onclick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				class="
					flex items-center gap-2 px-4 py-2 rounded-lg
					bg-[#2A2A2A] hover:bg-[#333333]
					disabled:opacity-50 disabled:cursor-not-allowed
					transition-colors
				"
			>
				<ChevronLeft size={20} class="text-white" />
				<span class="text-white font-medium hidden sm:inline">Previous</span>
			</button>

			<div class="flex items-center gap-1 md:gap-2">
				{#each getPageNumbers() as page (page)}
					{#if page === '...'}
						<span class="px-2 text-gray-400">...</span>
					{:else}
						<button
							onclick={() => onPageChange(page as number)}
							class="
								size-10 rounded-lg font-medium transition-colors
								{currentPage === page
									? 'bg-pink-600 text-white'
									: 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'}
							"
						>
							{page}
						</button>
					{/if}
				{/each}
			</div>

			<button
				onclick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				class="
					flex items-center gap-2 px-4 py-2 rounded-lg
					bg-[#2A2A2A] hover:bg-[#333333]
					disabled:opacity-50 disabled:cursor-not-allowed
					transition-colors
				"
			>
				<span class="text-white font-medium hidden sm:inline">Next</span>
				<ChevronRight size={20} class="text-white" />
			</button>
		</div>
	{/if}
</div>
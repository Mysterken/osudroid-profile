<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
	import LetterRank from '$lib/components/ui/LetterRank.svelte';
	import ModIcon from '$lib/components/ui/ModIcon.svelte';
	import LeaderboardTable from '$lib/components/leaderboard/LeaderboardTable.svelte';
	import LeaderboardFilters from '$lib/components/leaderboard/LeaderboardFilters.svelte';
	import type { FilterDef } from '$lib/components/leaderboard/LeaderboardFilters.svelte';
	import { TrophyIcon, AlertCircleIcon, ExternalLinkIcon } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';
	import type { BeatmapScore } from '$lib/models/beatmapScore';
	import {
		formatNumber,
		getPlayerAvatarUrl,
		getRankColor,
		getRankIcon
	} from '$lib/utils/leaderboard';
	import defaultAvatarImg from '$lib/assets/default/avatar.webp';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	const SCORES_PER_PAGE = 100;

	const beatmapId = $derived(parseInt(page.params.beatmapId ?? '', 10));

	let currentPage = $state(parseInt(page.url.searchParams.get('page') ?? '0', 10));
	let order = $state<'score' | 'pp'>(
		(page.url.searchParams.get('order') as 'score' | 'pp') ?? 'score'
	);

	let beatmap = $state<BeatmapExtended | null>(null);
	let scores = $state<BeatmapScore[]>([]);
	let isBeatmapLoading = $state(true);
	let isScoresLoading = $state(true);
	let beatmapError = $state<string | null>(null);
	let scoresError = $state<string | null>(null);

	let fetchController: AbortController | null = null;

	let hasNextPage = $derived(scores.length === SCORES_PER_PAGE);
	let totalPages = $derived(hasNextPage ? currentPage + 2 : currentPage + 1);
	let totalCount = $derived(
		hasNextPage
			? (currentPage + 2) * SCORES_PER_PAGE
			: currentPage * SCORES_PER_PAGE + scores.length
	);

	let pageTitle = $derived(
		beatmap
			? `${beatmap.beatmapset?.title ?? 'Beatmap'} [${beatmap.version}] - osu!droid`
			: 'Beatmap Leaderboard - osu!droid'
	);

	const filters = $derived<FilterDef[]>([
		{
			id: 'score-order',
			label: 'Sort by',
			value: order,
			options: [
				{ value: 'score', label: 'Score' },
				{ value: 'pp', label: 'PP' }
			],
			onChange: (v) => handleOrderChange(v as 'score' | 'pp')
		}
	]);

	const columns = [
		{ key: 'rank', label: 'Rank', align: 'left' as const, width: 'w-12' },
		{ key: 'grade', label: 'Grade', align: 'center' as const },
		{ key: 'player', label: 'Player', align: 'left' as const },
		{ key: 'score', label: 'Score', align: 'right' as const },
		{ key: 'accuracy', label: 'Accuracy', align: 'right' as const },
		{ key: 'combo', label: 'Max Combo', align: 'right' as const },
		{ key: 'miss', label: 'Miss', align: 'right' as const },
		{ key: 'pp', label: 'pp', align: 'right' as const },
		{ key: 'date', label: 'Time', align: 'right' as const },
		{ key: 'mods', label: 'Mods', align: 'right' as const }
	];

	async function fetchBeatmapById(): Promise<void> {
		isBeatmapLoading = true;
		beatmapError = null;
		try {
			const res = await fetch(`/api/beatmaps/${beatmapId}`);
			if (res.status === 404) {
				beatmapError = 'Beatmap not found.';
				return;
			}
			if (!res.ok) {
				beatmapError = 'Failed to load beatmap info.';
				return;
			}
			beatmap = (await res.json()) as BeatmapExtended;
		} catch (err) {
			beatmapError = 'An error occurred while loading beatmap info.';
			console.error('Error fetching beatmap:', err);
		} finally {
			isBeatmapLoading = false;
		}
	}

	async function fetchScores(): Promise<void> {
		if (!beatmap?.checksum) {
			isScoresLoading = false;
			return;
		}
		if (fetchController) fetchController.abort();
		fetchController = new AbortController();
		const signal = fetchController.signal;
		isScoresLoading = true;
		scoresError = null;
		try {
			const res = await fetch(
				`/api/leaderboard/beatmaps/${beatmap.checksum}?order=${order}&page=${currentPage}`,
				{ signal }
			);
			if (!res.ok) {
				if (!signal.aborted) scoresError = 'Failed to load scores.';
				return;
			}
			const data = await res.json();
			if (!signal.aborted) {
				scores = Array.isArray(data) ? data : [];
			}
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') return;
			scoresError = 'An error occurred while loading scores.';
		} finally {
			if (!fetchController?.signal.aborted) isScoresLoading = false;
		}
	}

	function updateUrl(): void {
		const params = new SvelteURLSearchParams();
		if (order !== 'score') params.set('order', order);
		if (currentPage !== 0) params.set('page', String(currentPage));
		const qs = params.toString();
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(qs ? `?${qs}` : resolve(`/leaderboard/beatmaps/${beatmapId}`), {
			keepFocus: true,
			noScroll: true,
			replaceState: true
		});
	}

	function handleOrderChange(newOrder: 'score' | 'pp'): void {
		order = newOrder;
		currentPage = 0;
		updateUrl();
		fetchScores();
	}

	function handlePageChange(p: number): void {
		currentPage = p - 1;
		updateUrl();
		fetchScores();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString();
	}

	function parseMods(
		mods: Array<{ acronym: string; settings?: Record<string, unknown> }>
	): string[] {
		if (!mods || !Array.isArray(mods) || mods.length === 0) return ['NM'];
		return mods.map((mod) => mod.acronym);
	}

	function formatAccuracy(accuracy: number): string {
		return (accuracy * 100).toFixed(2) + '%';
	}

	function handleAvatarError(event: Event): void {
		(event.target as HTMLImageElement).src = defaultAvatarImg;
	}

	onMount(async () => {
		await fetchBeatmapById();
		await fetchScores();
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta property="og:title" content={pageTitle} />
</svelte:head>

<SearchBar />

<ContentLayout>
	<div class="flex flex-col gap-6 py-6">
		<!-- Header -->
		<div class="flex items-start gap-4">
			{#if beatmap?.beatmapset?.covers?.cover}
				<img
					src={beatmap.beatmapset.covers.cover}
					alt="Beatmap cover"
					class="hidden tablet-sm:block w-36 h-[90px] object-cover rounded-xl shrink-0"
				/>
			{:else}
				<div
					class="hidden tablet-sm:flex items-center justify-center w-36 h-[90px] rounded-xl bg-[#2A2A2A] shrink-0"
				>
					<TrophyIcon size={32} class="text-gray-500" />
				</div>
			{/if}

			<div class="flex-1 min-w-0">
				{#if isBeatmapLoading}
					<div class="space-y-2">
						<div class="placeholder animate-pulse h-7 w-72 rounded"></div>
						<div class="placeholder animate-pulse h-4 w-52 rounded"></div>
						<div class="placeholder animate-pulse h-4 w-36 rounded"></div>
					</div>
				{:else if beatmap}
					<h1 class="text-2xl tablet-sm:text-3xl font-extrabold text-white leading-tight">
						{beatmap.beatmapset?.title ?? 'Unknown Title'}
					</h1>
					<p class="text-gray-400 text-sm mt-1">
						{beatmap.beatmapset?.artist ?? ''}
						{#if beatmap.beatmapset?.creator}
							<span class="text-gray-500"> · mapped by {beatmap.beatmapset.creator}</span>
						{/if}
					</p>
					<div class="flex flex-wrap items-center gap-3 mt-2">
						<span class="text-pink-400 font-semibold text-sm">[{beatmap.version}]</span>
						<span class="text-yellow-400 text-sm">★ {beatmap.difficulty_rating.toFixed(2)}</span>
						{#if beatmap.url}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href={beatmap.url} target="_blank" rel="noopener noreferrer">
								<button
									type="button"
									class="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
								>
									View on osu!
									<ExternalLinkIcon size={12} />
								</button>
							</a>
						{/if}
					</div>
				{:else}
					<h1 class="text-2xl font-extrabold text-white">Beatmap Leaderboard</h1>
					{#if beatmapError}
						<p class="text-red-400 text-sm mt-1 flex items-center gap-1.5">
							<AlertCircleIcon size={14} />{beatmapError}
						</p>
					{/if}
				{/if}
			</div>
		</div>

		<LeaderboardFilters {filters} />

		<LeaderboardTable
			rows={scores}
			{columns}
			isLoading={isScoresLoading}
			hasError={!!scoresError || (!beatmap?.checksum && !!beatmapError)}
			currentPage={currentPage + 1}
			{totalPages}
			pageSize={SCORES_PER_PAGE}
			{totalCount}
			emptyMessage="No scores found for this beatmap."
			loadingMessage="Loading scores..."
			onPageChange={handlePageChange}
			getRowKey={(score) => score.id}
		>
			{#snippet error()}
				{#if !beatmap?.checksum && beatmapError}
					<div class="flex flex-col items-center gap-2 my-4 text-gray-400">
						<AlertCircleIcon size={24} class="text-red-400" />
						<span class="text-sm">Cannot load scores: {beatmapError}</span>
					</div>
				{:else if scoresError}
					<div class="flex flex-col items-center gap-2 my-4 text-red-400">
						<AlertCircleIcon size={24} />
						<span class="text-sm">{scoresError}</span>
					</div>
				{/if}
			{/snippet}

			{#snippet row(score, i)}
				{@const rank = currentPage * SCORES_PER_PAGE + i + 1}
				{@const rankColor = getRankColor(rank)}
				{@const RankIcon = getRankIcon(rank)}
				{@const mods = parseMods(score.mods)}
				<tr
					class="border-b border-gray-800 hover:bg-[#333333] transition-colors whitespace-nowrap text-sm"
				>
					<td class="px-3 py-3">
						<div class="flex items-center gap-1.5">
							{#if RankIcon}
								<RankIcon size={14} class={rankColor} />
							{/if}
							<span class="font-semibold {rankColor}">#{rank}</span>
						</div>
					</td>

					<td class="px-2 py-3 text-center">
						<LetterRank
							rank={score.mark}
							sx="inline-flex size-7 text-white font-bold text-sm bg-[#1A1A1A] border border-[#3C3C3C] rounded items-center justify-center"
						/>
					</td>

					<td class="px-3 py-3">
						<a
							href={resolve(`/users/${score.uid}`)}
							class="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<img
								src={getPlayerAvatarUrl(score.uid)}
								alt={score.username}
								class="size-6 rounded-full bg-gray-700"
								onerror={handleAvatarError}
							/>
							<span class="text-white font-medium hover:underline">{score.username}</span>
						</a>
					</td>

					<td class="px-3 py-3 text-right">
						<span class="text-white font-semibold tracking-wide">{formatNumber(score.score)}</span>
					</td>

					<td class="px-3 py-3 text-right">
						<span class="text-gray-200">{formatAccuracy(score.accuracy)}</span>
					</td>

					<td class="px-3 py-3 text-right">
						<span class="text-gray-200">{formatNumber(score.combo)}x</span>
					</td>

					<td class="px-3 py-3 text-right">
						<span class="font-bold {score.miss > 0 ? 'text-red-400' : 'text-gray-500'}"
							>{formatNumber(score.miss ?? 0)}</span
						>
					</td>

					<td class="px-3 py-3 text-right">
						<span class="text-pink-400 font-bold">{Math.round(score.pp)}</span>
					</td>

					<td class="px-3 py-3 text-right text-gray-500 text-xs">
						{formatDate(score.date)}
					</td>

					<td class="px-3 py-3 text-right">
						<div class="flex gap-0.5 justify-end">
							{#each mods as mod (mod)}
								<ModIcon {mod} size={18} />
							{/each}
						</div>
					</td>
				</tr>
			{/snippet}

			{#snippet card(score, i)}
				{@const rank = currentPage * SCORES_PER_PAGE + i + 1}
				{@const rankColor = getRankColor(rank)}
				{@const RankIcon = getRankIcon(rank)}
				{@const mods = parseMods(score.mods)}
				<div class="border-b border-gray-800 p-4 hover:bg-[#333333] transition-colors">
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-1 w-10 shrink-0">
							{#if RankIcon}
								<RankIcon size={14} class={rankColor} />
							{/if}
							<span class="text-xs font-semibold {rankColor}">#{rank}</span>
						</div>
						<LetterRank
							rank={score.mark}
							sx="flex size-8 min-w-8 text-white font-bold text-sm bg-[#1A1A1A] border border-[#3C3C3C] rounded items-center justify-center"
						/>
						<a
							href={resolve(`/users/${score.uid}`)}
							class="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
						>
							<img
								src={getPlayerAvatarUrl(score.uid)}
								alt={score.username}
								class="size-8 rounded-full bg-gray-700 shrink-0"
								onerror={handleAvatarError}
							/>
							<span class="text-white font-medium text-sm truncate">{score.username}</span>
						</a>
						<div class="text-right shrink-0">
							<p class="text-white text-sm font-semibold">{formatNumber(score.score)}</p>
							<p class="text-gray-400 text-xs">{formatAccuracy(score.accuracy)}</p>
						</div>
					</div>
					<div class="flex items-center justify-between mt-2 pl-[3.25rem] gap-2 flex-wrap">
						<div class="flex gap-0.5 items-center">
							{#each mods as mod (mod)}
								<ModIcon {mod} size={16} />
							{/each}
						</div>
						<div class="flex items-center gap-3 text-xs text-gray-400 ml-auto">
							<span>{score.combo}x combo</span>
							<span class="text-red-400">{score.miss} miss</span>
							<span class="text-white font-semibold">
								{Math.round(score.pp)}<span class="text-gray-400 font-normal">pp</span>
							</span>
							<span>{formatDate(score.date)}</span>
						</div>
					</div>
				</div>
			{/snippet}
		</LeaderboardTable>
	</div>
</ContentLayout>

<Footer />

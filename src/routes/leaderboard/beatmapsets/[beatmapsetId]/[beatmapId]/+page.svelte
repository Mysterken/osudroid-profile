<script lang="ts">
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
	import LetterRank from '$lib/components/ui/LetterRank.svelte';
	import ModIcon from '$lib/components/ui/ModIcon.svelte';
	import LeaderboardTable from '$lib/components/leaderboard/LeaderboardTable.svelte';
	import LeaderboardFilters from '$lib/components/leaderboard/LeaderboardFilters.svelte';
	import type { FilterDef } from '$lib/components/leaderboard/LeaderboardFilters.svelte';
	import {
		TrophyIcon,
		ExternalLinkIcon,
		PlayIcon,
		SquareIcon,
		CircleAlertIcon
	} from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import type { BeatmapExtended, Beatmapset } from '$lib/models/osuApi/beatmap';
	import type { BeatmapScore } from '$lib/models/beatmapScore';
	import {
		formatNumber,
		getPlayerAvatarUrl,
		getRankColor,
		getRankIcon
	} from '$lib/utils/leaderboard';
	import { playUtils } from '$lib/utils/playUtils';
	import defaultAvatarImg from '$lib/assets/default/avatar.webp';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { getDifficultyColor } from '$lib/utils/colors';

	const SCORES_PER_PAGE = 100;

	const beatmapsetId = $derived(parseInt(page.params.beatmapsetId ?? '', 10));
	const beatmapId = $derived(parseInt(page.params.beatmapId ?? '', 10));

	let currentPage = $state(parseInt(page.url.searchParams.get('page') ?? '0', 10));
	let order = $state<'score' | 'pp'>(
		(page.url.searchParams.get('order') as 'score' | 'pp') ?? 'score'
	);

	let beatmapset = $state<Beatmapset | null>(null);
	let beatmap = $state<BeatmapExtended | null>(null);
	let scores = $state<BeatmapScore[]>([]);
	let isBeatmapsetLoading = $state(true);
	let isScoresLoading = $state(true);
	let beatmapsetError = $state<string | null>(null);
	let scoresError = $state<string | null>(null);
	let hoveredBeatmap = $state<(typeof availableBeatmaps)[0] | null>(null);
	let displayBeatmap = $derived(hoveredBeatmap || beatmap);

	let audioEl = $state<HTMLAudioElement>();
	let isPlaying = $state(false);

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
			? `${beatmapset?.title ?? 'Beatmap'} [${beatmap.version}] - osu!droid`
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

	// Get all beatmaps in the beatmapset for difficulty selector
	let availableBeatmaps = $derived(
		beatmapset?.beatmaps
			?.filter((b) => b.mode === 'osu')
			.sort((a, b) => a.difficulty_rating - b.difficulty_rating) ?? []
	);

	// Helper functions
	function getStatusLabel(status: number): string {
		const statusMap: Record<number, string> = {
			'-2': 'Graveyard',
			'-1': 'WIP',
			'0': 'Pending',
			'1': 'Ranked',
			'2': 'Approved',
			'3': 'Qualified',
			'4': 'Loved'
		};
		return statusMap[status] || 'Unknown';
	}

	function getStatusColor(status: number): string {
		const colorMap: Record<number, string> = {
			'-2': 'text-gray-500',
			'-1': 'text-gray-400',
			'0': 'text-yellow-500',
			'1': 'text-green-500',
			'2': 'text-blue-500',
			'3': 'text-cyan-500',
			'4': 'text-pink-500'
		};
		return colorMap[status] || 'text-gray-400';
	}

	async function fetchBeatmapset(): Promise<void> {
		isBeatmapsetLoading = true;
		beatmapsetError = null;
		try {
			const res = await fetch(`/api/beatmapset/${beatmapsetId}`);
			if (res.status === 404) {
				beatmapsetError = 'Beatmapset not found.';
				return;
			}
			if (!res.ok) {
				beatmapsetError = 'Failed to load beatmapset info.';
				return;
			}
			beatmapset = (await res.json()) as Beatmapset;

			// Find the specific beatmap from the beatmapset
			beatmap = (beatmapset.beatmaps?.find((b) => b.id === beatmapId) as BeatmapExtended) ?? null;

			if (!beatmap) {
				beatmapsetError = 'Beatmap not found in beatmapset.';
			}
		} catch (err) {
			beatmapsetError = 'An error occurred while loading beatmapset info.';
			console.error('Error fetching beatmapset:', err);
		} finally {
			isBeatmapsetLoading = false;
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
		goto(qs ? `?${qs}` : resolve(`/leaderboard/beatmapsets/${beatmapsetId}/${beatmapId}`), {
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

	function handleDifficultyChange(newBeatmapId: number): void {
		if (newBeatmapId === beatmapId) return;
		stopPreview();
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(`/leaderboard/beatmapsets/${beatmapsetId}/${newBeatmapId}`, { invalidateAll: true });
	}

	function playPreview(): void {
		if (!audioEl) return;

		if (isPlaying) {
			audioEl.pause();
			audioEl.currentTime = 0;
		} else {
			audioEl.play();
		}
		isPlaying = !isPlaying;
	}

	function stopPreview(): void {
		if (audioEl) {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
		isPlaying = false;
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

	$effect(() => {
		const currentSetId = beatmapsetId;
		const currentMapId = beatmapId;

		if (currentSetId && currentMapId) {
			untrack(() => {
				stopPreview();

				// Keep pagination and sorting in sync with the URL when switching difficulties
				currentPage = parseInt(page.url.searchParams.get('page') ?? '0', 10);
				order = (page.url.searchParams.get('order') as 'score' | 'pp') ?? 'score';

				// Just swap the active difficulty and fetch the new scores.
				if (beatmapset?.beatmaps?.some((b) => b.id === currentMapId)) {
					beatmap =
						(beatmapset.beatmaps.find((b) => b.id === currentMapId) as BeatmapExtended) ?? null;

					if (beatmap) {
						beatmapsetError = null;
						fetchScores();
					} else {
						beatmapsetError = 'Beatmap not found in beatmapset.';
					}
				} else {
					// Initial load, or navigating to an entirely new map
					fetchBeatmapset().then(() => fetchScores());
				}
			});
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta property="og:title" content={pageTitle} />
</svelte:head>

{#if beatmapset?.preview_url}
	<audio bind:this={audioEl} src={beatmapset.preview_url} onended={() => (isPlaying = false)}
	></audio>
{/if}

<SearchBar />

<ContentLayout>
	<div class="flex flex-col gap-6 py-6">
		<!-- Hero Section -->
		{#if isBeatmapsetLoading}
			<div class="relative rounded-xl overflow-hidden bg-[#2A2A2A] animate-pulse">
				<div class="h-48 tablet-sm:h-64"></div>
			</div>
		{:else if beatmap && beatmapset}
			<div
				class="relative rounded-xl overflow-hidden bg-[#1E1E1E] border border-gray-800 flex flex-col"
			>
				{#if beatmapset.covers?.cover}
					<div class="absolute inset-0 z-0">
						<img
							src={beatmapset.covers.cover}
							alt="Beatmap background"
							class="w-full h-full object-cover opacity-30 blur-sm"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/80 to-transparent"
						></div>
					</div>
				{/if}

				{#if availableBeatmaps.length > 1}
					<div
						class="relative z-10 w-full bg-black/40 border-b border-[#3C3C3C]/50 px-6 py-3 flex flex-col gap-2"
					>
						<div class="flex items-center gap-2 h-6">
							<span class="text-sm font-bold text-white drop-shadow-md">
								{displayBeatmap?.version ?? ''}
							</span>
							<span class="text-yellow-400 font-bold text-sm drop-shadow-md">
								★ {displayBeatmap?.difficulty_rating?.toFixed(2) ?? '0.00'}
							</span>
						</div>

						<div class="flex gap-1.5 overflow-x-auto no-scrollbar pl-1 py-1 items-center">
							{#each availableBeatmaps as diff (diff.id)}
								<button
									type="button"
									onmouseenter={() => (hoveredBeatmap = diff)}
									onmouseleave={() => (hoveredBeatmap = null)}
									onclick={() => handleDifficultyChange(diff.id)}
									aria-label={diff.version}
									class="size-[22px] shrink-0 rounded-full border-[2.5px] transition-all duration-200 {diff.id ===
									beatmapId
										? 'border-white scale-110'
										: 'border-transparent opacity-60 hover:opacity-100 hover:scale-110'}"
									style="background-color: {getDifficultyColor(diff.difficulty_rating)};"
								></button>
							{/each}
						</div>
					</div>
				{/if}

				<div class="relative z-10 p-6 tablet-sm:p-8">
					<div class="flex flex-col tablet-sm:flex-row gap-4 items-start">
						{#if beatmapset.covers?.cover}
							<img
								src={beatmapset.covers.cover}
								alt="Beatmap cover"
								class="w-full tablet-sm:w-48 h-32 tablet-sm:h-32 object-cover rounded-lg shadow-lg shrink-0"
							/>
						{:else}
							<div
								class="w-full tablet-sm:w-48 h-32 rounded-lg bg-[#2A2A2A] flex items-center justify-center shrink-0"
							>
								<TrophyIcon size={48} class="text-gray-500" />
							</div>
						{/if}

						<div class="flex-1 min-w-0 space-y-3">
							<div>
								<h1 class="text-3xl tablet-sm:text-4xl font-extrabold text-white leading-tight">
									{beatmapset.title ?? 'Unknown Title'}
								</h1>
								<p class="text-gray-300 text-lg mt-1">
									{beatmapset.artist ?? ''}
								</p>
								<p class="text-gray-400 text-sm mt-1">
									mapped by <span class="text-white font-medium"
										>{beatmapset.creator ?? 'Unknown'}</span
									>
								</p>
							</div>

							<div class="flex flex-wrap items-center gap-4 text-sm mt-2">
								<span class="text-gray-300">
									Length: <span class="text-white font-medium"
										>{playUtils.formatLength(beatmap.total_length)}</span
									>
								</span>
								<span class="text-gray-300">
									BPM: <span class="text-white font-medium">{beatmap.bpm ?? 'N/A'}</span>
								</span>
								<span class="text-gray-300">
									CS: <span class="text-white font-medium">{beatmap.cs}</span>
								</span>
								<span class="text-gray-300">
									HP: <span class="text-white font-medium">{beatmap.drain}</span>
								</span>
								<span class="text-gray-300">
									OD: <span class="text-white font-medium">{beatmap.accuracy}</span>
								</span>
								<span class="text-gray-300">
									AR: <span class="text-white font-medium">{beatmap.ar}</span>
								</span>
								{#if beatmap.ranked !== undefined}
									<div class="h-4 w-px bg-gray-600"></div>
									<span
										class="px-2 py-1 rounded text-xs font-bold {getStatusColor(
											beatmap.ranked
										)} bg-black/40 border border-current"
									>
										{getStatusLabel(beatmap.ranked)}
									</span>
								{/if}
							</div>

							<div class="flex flex-wrap items-center gap-3 mt-2">
								{#if beatmapset.preview_url}
									<button
										type="button"
										onclick={playPreview}
										class="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
									>
										{#if isPlaying}
											<SquareIcon size={16} />
											Stop Preview
										{:else}
											<PlayIcon size={16} />
											Play Preview
										{/if}
									</button>
								{/if}
								{#if beatmap.url}
									<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
									<a href={beatmap.url} target="_blank" rel="noopener noreferrer">
										<button
											type="button"
											class="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-semibold transition-colors"
										>
											View on osu!
											<ExternalLinkIcon size={16} />
										</button>
									</a>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if beatmapsetError}
			<div class="flex flex-col items-center gap-2 my-8 text-red-400">
				<CircleAlertIcon
				size={48} />
				<h1 class="text-xl font-bold">Beatmap Not Found</h1>
				<p class="text-sm text-gray-400">{beatmapsetError}</p>
			</div>
		{/if}

		<LeaderboardFilters {filters} />

		<LeaderboardTable
			rows={scores}
			{columns}
			isLoading={isScoresLoading}
			hasError={!!scoresError || (!beatmap?.checksum && !!beatmapsetError)}
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
				{#if !beatmap?.checksum && beatmapsetError}
					<div class="flex flex-col items-center gap-2 my-4 text-gray-400">
						<CircleAlertIcon size={24} class="text-red-400" />
						<span class="text-sm">Cannot load scores: {beatmapsetError}</span>
					</div>
				{:else if scoresError}
					<div class="flex flex-col items-center gap-2 my-4 text-red-400">
						<CircleAlertIcon size={24} />
						<span class="text-sm">{scoresError}</span>
					</div>
				{/if}
			{/snippet}

			{#snippet row(score, i)}
				{@const rank = currentPage * SCORES_PER_PAGE + i + 1}
				{@const rankColor = getRankColor(rank)}
				{@const mods = parseMods(score.mods)}
				{@const isMaxCombo = beatmap?.max_combo && score.combo >= beatmap.max_combo}
				<tr
					class="border-b border-gray-800 hover:bg-[#333333] transition-colors whitespace-nowrap text-sm"
				>
					<td class="px-3 py-3">
						<div class="flex items-center gap-1.5">
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
						<span
							class={isMaxCombo ? 'font-bold' : 'text-gray-200'}
							style={isMaxCombo ? 'color: hsl(90, 100%, 70%)' : ''}
							>{formatNumber(score.combo)}x</span
						>
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
				{@const isMaxCombo = beatmap?.max_combo && score.combo >= beatmap.max_combo}
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
							<span
								class={isMaxCombo ? 'font-bold' : ''}
								style={isMaxCombo ? 'color: hsl(90, 100%, 70%)' : ''}>{score.combo}x combo</span
							>
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

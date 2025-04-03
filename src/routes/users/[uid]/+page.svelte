<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApiPlayer, MergedPlayer, ScraperPlayer } from '$lib/models/player';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ProfileInfoMobile from '$lib/components/users/profile-info/ProfileInfoMobile.svelte';
	import ProfileInfoDesktop from '$lib/components/users/profile-info/ProfileInfoDesktop.svelte';
	import TopPlays from '$lib/components/users/top-plays/TopPlays.svelte';
	import RecentPlays from '$lib/components/users/recent-plays/RecentPlays.svelte';
	import RankingPanel from '$lib/components/users/side-stats/RankingPanel.svelte';
	import StatisticsPanel from '$lib/components/users/side-stats/StatisticsPanel.svelte';
	import UserInfoPanel from '$lib/components/users/side-stats/UserInfoPanel.svelte';
	import type { BeatmapExtended } from '$lib/models/osuApi/beatmap';
	import type { Play, ScraperPlay } from '$lib/models/play';
	import UserIsLoading from '$lib/components/skeletons/UserIsLoading.svelte';
	import UserNotFound from '$lib/components/users/not-found/UserNotFound.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import BeatmapModal from '$lib/components/ui/BeatmapModal.svelte';

	let user = $state<ApiPlayer | ScraperPlayer | MergedPlayer | null>(null);
	let globalRank = $state(0);
	let countryRank = $state(0);
	let scoreRank = $state(0);
	let ppRank = $state(0);
	let registered = $state('');
	let lastLogin = $state('');
	let beatmaps = new SvelteMap<string, BeatmapExtended | null>();

	let isLoading = $state(true);
	let topPlaysToShow = $state(5);
	let recentPlaysToShow = $state(5);
	let isFetchingMore = false;

	let selectedBeatmap: BeatmapExtended | null | undefined = $state();
	let dialog: HTMLDialogElement | undefined = $state();

	async function fetchUser(userId: string): Promise<ApiPlayer | ScraperPlayer | MergedPlayer | null> {
		try {
			const response = await fetch(`/api/users/${userId}`);
			if (!response.ok) return null;
			return (await response.json()) as ApiPlayer | ScraperPlayer | MergedPlayer;
		} catch (error) {
			console.error('Error fetching user:', error);
			return null;
		}
	}

	async function fetchBeatmapsBatch(topPlays: Play[]) {
		try {
			const lookups = topPlays.map(play => ({
				filename: play.Filename,
				hash: (play as ScraperPlay)?.Hash
			}));

			const response = await fetch('/api/beatmaps', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lookups })
			});

			if (!response.ok) return;
			const data = await response.json();

			for (const item of data) {
				beatmaps.set(item.key, item.beatmap ?? null);
			}
		} catch (error) {
			console.error('Error fetching beatmaps batch:', error);
		}
	}

	async function fetchBeatmapsInRange(topPlays: Play[], start: number, end: number) {
		if (isFetchingMore || beatmaps.size >= topPlays.length) return;

		if (start >= 25) isFetchingMore = true;

		const slice = topPlays.slice(start, end);
		await fetchBeatmapsBatch(slice);

		if (start >= 25) isFetchingMore = false;
	}

	function openModal(beatmap: BeatmapExtended | null | undefined) {
		selectedBeatmap = beatmap;
		dialog?.showModal();
	}

	onMount(async () => {
		const userId = window.location.pathname.split('/').pop() || '';
		user = await fetchUser(userId);

		if (user?.Source === 'merged') {
			({
				GlobalRank: globalRank,
				CountryRank: countryRank,
				Registered: registered,
				LastLogin: lastLogin,
				ScoreRank: scoreRank,
				PPRank: ppRank
			} = user);
		} else if (user?.Source === 'api') {
			({
				GlobalRank: globalRank,
				CountryRank: countryRank,
				Registered: registered,
				LastLogin: lastLogin
			} = user);
		} else if (user?.Source === 'scraper') {
			({ ScoreRank: scoreRank, PPRank: ppRank } = user);
		} else {
			user = null;
		}

		if (user?.Top50Plays) {
			await fetchBeatmapsInRange(user.Top50Plays, 0, 5);
			fetchBeatmapsInRange(user.Top50Plays, 5, 25);
		}

		isLoading = false;
	});

	$effect(() => {
		if (topPlaysToShow === 25 && user?.Top50Plays) {
			fetchBeatmapsInRange(user.Top50Plays, 25, 50);
		}
	});

	$effect(() => {
		if (isLoading) {
			document.title = 'Loading... - osu!droid';
		} else if (user?.Username) {
			document.title = `${user.Username}'s Profile - osu!droid`;
		} else {
			document.title = 'User Not Found - osu!droid';
		}
	});
</script>

<SearchBar />

<ContentLayout>
	{#if isLoading}
		<UserIsLoading />
	{:else}
		{#if user}
			<BeatmapModal bind:dialog beatmap={selectedBeatmap} />
			<!-- Desktop Layout -->
			<div class="hidden desktop-sm:grid grid-cols-[1fr_3fr] gap-8">
				<!-- Sidebar -->
				<div class="flex flex-col gap-4 w-[300px] sticky top-28 self-start">
					<RankingPanel
						source={user.Source}
						globalRanking={globalRank}
						countryRanking={countryRank}
						scoreRanking={scoreRank}
						ppRanking={ppRank}
					/>
					<StatisticsPanel
						source={user.Source}
						performancePoints={user.OverallPP}
						score={user.OverallScore}
						accuracy={user.OverallAccuracy}
						playcount={user.OverallPlaycount}
					/>
					{#if user.Source === 'api' || user.Source === 'merged'}
						<UserInfoPanel
							registered={registered}
							lastLogin={lastLogin}
						/>
					{/if}
				</div>

				<!-- Main Content -->
				<div class="flex flex-col gap-8">
					<ProfileInfoDesktop
						avatarLink="https://osudroid.moe/user/avatar/{user.UserId}.png"
						username={user.Username}
						country={user.Region}
					/>
					<TopPlays topPlays={user.Top50Plays} bind:itemsToShow={topPlaysToShow} {beatmaps} {openModal} />
					<RecentPlays recentPlays={user.Last50Scores} bind:itemsToShow={recentPlaysToShow} {openModal} />
				</div>
			</div>

			<!-- Mobile/Tablet Layout -->
			<div
				class="
				desktop-sm:hidden
				flex flex-col
				phone-sm:gap-2.5 phone-sm:py-2.5
				phone-lg:gap-3.5 phone-lg:py-3.5
				tablet-sm:gap-5 tablet-sm:p-5
				tablet-lg:gap-6 tablet-lg:p-6"
			>
				<ProfileInfoMobile
					source={user.Source}
					username={user.Username}
					country={user.Region}
					avatarLink="https://osudroid.moe/user/avatar/{user.UserId}.png"
					globalRanking={globalRank}
					countryRanking={countryRank}
					scoreRanking={scoreRank}
					ppRanking={ppRank}
					performancePoints={user.OverallPP}
					score={user.OverallScore}
					accuracy={user.OverallAccuracy}
					playcount={user.OverallPlaycount}
					registered={registered}
					lastLogin={lastLogin}
				/>
				<TopPlays topPlays={user.Top50Plays} bind:itemsToShow={topPlaysToShow} {beatmaps} {openModal} />
				<RecentPlays recentPlays={user.Last50Scores} bind:itemsToShow={recentPlaysToShow} {openModal} />
			</div>

		{:else}
			<UserNotFound />
		{/if}
	{/if}
</ContentLayout>

<Footer />
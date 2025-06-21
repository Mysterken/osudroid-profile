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
	import type { PageProps } from './$types';
	import { getUserField } from '$lib/utils/user';
	import { playUtils } from '$lib/utils/playUtils';

	let { data }: PageProps = $props();

	let user = $state<ApiPlayer | ScraperPlayer | MergedPlayer | null>(data?.user);

	let globalRank = $state(getUserField(data?.user, 'GlobalRank', 0)) as number;
	let countryRank = $state(getUserField(data?.user, 'CountryRank', 0)) as number;
	let scoreRank = $state(getUserField(data?.user, 'ScoreRank', 0)) as number;
	let ppRank = $state(getUserField(data?.user, 'PPRank', 0)) as number;
	let registered = $state(getUserField(data?.user, 'Registered', '')) as string;
	let lastLogin = $state(getUserField(data?.user, 'LastLogin', '')) as string;

	let beatmaps = new SvelteMap<string, BeatmapExtended | null>();

	let isLoading = $state(!data?.user);
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

	function getDescription() {
		if (!user) return '';

		const rank = globalRank
			? `#${globalRank} Global`
			: countryRank
				? `#${countryRank} Country`
				: '';

		const accuracy = `${(user.OverallAccuracy * (user.Source === 'scraper' ? 1 : 100)).toFixed(2)}%`;

		let description = `${rank} • ${accuracy} • ${Math.round(user.OverallPP)} PP`;

		if (user.Top50Plays?.length) {
			const topPlaysInfo = user.Top50Plays.slice(0, 3)
				.map((play, index) => {
					const { songTitle, difficulty } = playUtils.convertTitleToBeatmapMetadata(play.Filename);
					const ppValue = play.MapPP ? Math.round(play.MapPP) : 'N/A';
					const mods = play.Mods.join('') || 'NM';

					return `${index + 1}. ${songTitle} [${difficulty}] +${mods} • ${ppValue}pp`;
				})
				.join('\n');

			description += `\n\n${topPlaysInfo}`;
		}

		return description;
	}

	onMount(async () => {

		if (user) {
			return;
		}

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

</script>

<svelte:head>
	{#if isLoading }
		<title>Loading... - osu!droid</title>
	{:else if user?.Username}
		<title>{user.Username} - osu!droid Profile</title>
		<meta property="og:title" content="{user.Username} - osu!droid Profile" />
		<meta property="profile:username" content="{user.Username}">
		<meta property="og:description" content="{getDescription()}" />
		<meta property="og:image" content="https://new.osudroid.moe/api2/frontend/avatar/userid/{user.UserId}?size=256" />
	{:else}
		<title>User Not Found - osu!droid</title>
		<meta property="og:title" content="User Not Found - osu!droid" />
		<meta property="og:description" content="User not found on osu!droid." />
	{/if}
</svelte:head>

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
						avatarLink="https://new.osudroid.moe/api2/frontend/avatar/userid/{user.UserId}?size=256"
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
					avatarLink="https://new.osudroid.moe/api2/frontend/avatar/userid/{user.UserId}?size=256"
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
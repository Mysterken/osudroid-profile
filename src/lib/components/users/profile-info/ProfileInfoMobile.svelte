<script lang="ts">
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { timestamp, timeAgoStore } from '$lib/stores/timeAgo';

	let {
		source,
		avatarLink,
		username,
		country,
		globalRanking,
		countryRanking,
		scoreRanking,
		ppRanking,
		performancePoints,
		score,
		accuracy,
		playcount,
		registered,
		lastLogin
	}: {
		source: 'api' | 'scraper';
		avatarLink: string;
		username: string;
		country: string;
		globalRanking: number | null;
		countryRanking: number | null;
		scoreRanking: number | null;
		ppRanking: number | null;
		performancePoints: number;
		score: number;
		accuracy: number;
		playcount: number;
		registered: string | null;
		lastLogin: string | null;
	} = $props();

	let calculatedAccuracy = source === 'api' ? (accuracy * 100).toFixed(2) : accuracy;

	let formattedScore = score.toLocaleString();

	let formattedPlaycount = playcount.toLocaleString();

	let formattedRegistered = registered ? new Date(registered).toLocaleDateString() : 'N/A';

	$effect(() => {
		timestamp.set(lastLogin);
	});

	const stats = [
		{ name: 'Performance Points', value: performancePoints, id: 'pp' },
		{ name: 'Score', value: formattedScore, id: 'score' },
		{ name: 'Hit Accuracy', value: calculatedAccuracy, id: 'accuracy' },
		{ name: 'Play Count', value: formattedPlaycount, id: 'playcount' }
	];
</script>

{#snippet userIdentity()}
	<div class="user-identity flex gap-3.5">
		<div class="user-avatar size-[80px] bg-[#FFFFFF] rounded-[10px] overflow-hidden">
			<img src={avatarLink} alt="User Avatar" />
		</div>
		<div class="user-info flex flex-col justify-end text-left">
			<h1 class="font-bold text-lg">{username}</h1>
			<p class="text-sm text-gray-400">{country}</p>
		</div>
	</div>
{/snippet}

{#snippet userRankings()}
	<div class="user-rankings flex gap-7 px-2 text-left">
		<div class="global-ranking">
			<h3 class="text-sm text-gray-400">{source === 'api' ? 'Global Ranking' : 'Score Ranking'}</h3>
			<h1 class="font-bold text-lg">#{source === 'api' ? globalRanking : scoreRanking}</h1>
		</div>
		<div class="country-ranking">
			<h3 class="text-sm text-gray-400">{source === 'api' ? 'Country Ranking' : 'PP Ranking'}</h3>
			<h1 class="font-bold text-lg">#{source === 'api' ? countryRanking : ppRanking}</h1>
		</div>
	</div>
{/snippet}

{#snippet userStats()}
	<table class="w-full text-sm max-w-[400px]">
		<tbody>
		{#each stats as stat (stat.id)}
			<tr>
				<td class="py-0.5 tablet-sm:py-1 text-left">{stat.name}</td>
				<td class="py-0.5 tablet-sm:py-1 text-right font-bold">{stat.value}</td>
			</tr>
		{/each}
		</tbody>
	</table>
{/snippet}

{#snippet userDates()}
	<div class="registered-date">
		<h3 class="text-sm text-gray-400">Registered</h3>
		<h1 class="font-bold text-xs">{formattedRegistered}</h1>
	</div>
	<div class="last-login">
		<h3 class="text-sm text-gray-400">Last Login</h3>
		<h1 class="font-bold text-xs">{$timeAgoStore}</h1>
	</div>
{/snippet}

<ContentCard>
	<div
		class="
			user-info
			flex flex-col gap-2.5
			tablet-sm:grid tablet-sm:grid-cols-[2fr_1fr_3fr] tablet-sm:gap-8
		"
	>
		<div class="flex flex-col gap-2.5">
			{@render userIdentity()}
			{@render userRankings()}
		</div>

		<!-- Separators -->
		<div class="hidden tablet-sm:flex justify-center items-center">
			<span class="vr"></span>
		</div>

		<div class="tablet-sm:hidden justify-center items-center">
			<hr class="hr w-full tablet-sm:invisible" />
		</div>

		<div class="user-stats flex flex-col justify-center w-full px-2">
			{@render userStats()}
		</div>

		{#if source === 'api'}
			<div class="tablet-sm:hidden justify-center items-center">
				<hr class="hr w-full tablet-sm:invisible" />
			</div>

			<div class="user-dates tablet-sm:hidden flex gap-7 px-2 text-left">
				{@render userDates()}
			</div>
		{/if}
	</div>
	{#if source === 'api'}
		<div class="user-dates hidden tablet-sm:flex gap-7 px-2 pt-2 text-left">
			{@render userDates()}
		</div>
	{/if}
</ContentCard>

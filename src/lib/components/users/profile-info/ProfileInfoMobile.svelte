<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
</script>

{#snippet userIdentity()}
	<div class="user-identity flex gap-3.5">
		<div class="user-avatar size-[80px] bg-[#FFFFFF] rounded-[10px] overflow-hidden">
			<img src="https://via.placeholder.com/150" alt="User Avatar" />
		</div>
		<div class="user-info flex flex-col justify-end text-left">
			<h1 class="font-bold text-lg">Username</h1>
			<p class="text-sm text-gray-400">Country</p>
		</div>
	</div>
{/snippet}

{#snippet userRankings()}
	<div class="user-rankings flex gap-7 px-2 text-left">
		<div class="global-ranking">
			<h3 class="text-sm text-gray-400">Global Ranking</h3>
			<h1 class="font-bold text-lg">#1</h1>
		</div>
		<div class="country-ranking">
			<h3 class="text-sm text-gray-400">Country Ranking</h3>
			<h1 class="font-bold text-lg">#1</h1>
		</div>
	</div>
{/snippet}

{#snippet userStats()}
	<table class="w-full text-sm max-w-[400px]">
		<tbody>
		<tr>
			<td class="py-0.5 tablet-sm:py-1 text-left">Performance Points</td>
			<td class="py-0.5 tablet-sm:py-1 text-right font-bold">6000</td>
		</tr>
		<tr>
			<td class="py-0.5 tablet-sm:py-1 text-left">Score</td>
			<td class="py-0.5 tablet-sm:py-1 text-right font-bold">17,183,008,068</td>
		</tr>
		<tr>
			<td class="py-0.5 tablet-sm:py-1 text-left">Hit Accuracy</td>
			<td class="py-0.5 tablet-sm:py-1 text-right font-bold">99.29%</td>
		</tr>
		<tr>
			<td class="py-0.5 tablet-sm:py-1 text-left">Play Count</td>
			<td class="py-0.5 tablet-sm:py-1 text-right font-bold">1213</td>
		</tr>
		</tbody>
	</table>
{/snippet}

{#snippet userDates()}
	<div class="registered-date">
		<h3 class="text-sm text-gray-400">Registered</h3>
		<h1 class="font-bold text-xs">22/05/2016</h1>
	</div>
	<div class="last-login">
		<h3 class="text-sm text-gray-400">Last Login</h3>
		<h1 class="font-bold text-xs">a year ago</h1>
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

		<div class="tablet-sm:hidden justify-center items-center">
			<hr class="hr w-full tablet-sm:invisible" />
		</div>

		<div class="user-dates tablet-sm:hidden flex gap-7 px-2 text-left">
			{@render userDates()}
		</div>
	</div>
	<div class="user-dates hidden tablet-sm:flex gap-7 px-2 pt-2 text-left">
		{@render userDates()}
	</div>
</ContentCard>

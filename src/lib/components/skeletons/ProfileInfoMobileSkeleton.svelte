<script lang="ts">
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';

	const stats = [
		{ name: 'Performance Points', width: 'w-16', id: 'pp' },
		{ name: 'Score', width: 'w-32', id: 'score' },
		{ name: 'Hit Accuracy', width: 'w-16', id: 'accuracy' },
		{ name: 'Play Count', width: 'w-12', id: 'playcount' }
	];
</script>

{#snippet userIdentity()}
	<div class="user-identity flex gap-3.5">
		<div class="user-avatar size-[80px] rounded-[10px] placeholder animate-pulse"></div>
		<div class="user-info flex flex-col justify-end text-left gap-1">
			<div class="placeholder animate-pulse h-5 w-20"></div>
			<div class="placeholder animate-pulse h-3.5 w-15"></div>
		</div>
	</div>
{/snippet}

{#snippet userRankings()}
	<div class="user-rankings flex gap-7 px-2 text-left">
		<div class="global-ranking flex flex-col gap-1">
			<h3 class="text-sm text-gray-400">Global Ranking</h3>
			<div class="placeholder animate-pulse h-5 w-16"></div>
		</div>
		<div class="country-ranking flex flex-col gap-1">
			<h3 class="text-sm text-gray-400">Country Ranking</h3>
			<div class="placeholder animate-pulse h-5 w-16"></div>
		</div>
	</div>
{/snippet}

{#snippet userStats()}
	<table class="w-full text-sm max-w-[400px]">
		<tbody>
			{#each stats as stat (stat.id)}
				<tr>
					<td class="py-0.5 tablet-sm:py-1 text-left">{stat.name}</td>
					<td class="py-0.5 tablet-sm:py-1 text-right font-bold">
						<div class="placeholder animate-pulse ml-auto {stat.width}"></div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/snippet}

{#snippet userDates()}
	<div class="registered-date flex flex-col">
		<h3 class="text-sm text-gray-400">Registered</h3>
		<div class="placeholder animate-pulse h-3 w-20"></div>
	</div>
	<div class="last-login flex flex-col">
		<h3 class="text-sm text-gray-400">Last Login</h3>
		<div class="placeholder animate-pulse h-3 w-16"></div>
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

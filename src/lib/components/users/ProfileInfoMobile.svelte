<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
</script>

<ContentCard>
	<div
		class="
			user-info
			flex flex-col gap-2.5
			tablet-sm:grid tablet-sm:grid-cols-[2fr_1fr_3fr] tablet-sm:gap-8
		"
	>
		<div class="flex flex-col gap-2.5">
			<!-- User Identity -->
			<div class="user-identity flex gap-3.5">
				<div class="user-avatar size-[80px] bg-[#FFFFFF] rounded-[10px] overflow-hidden">
					<img src="https://via.placeholder.com/150" alt="User Avatar" />
				</div>
				<div class="user-info flex flex-col justify-end text-left">
					<h1 class="font-bold text-lg">Username</h1>
					<p class="text-sm text-gray-400">Country</p>
				</div>
			</div>

			<!-- User Rankings -->
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
		</div>

		<!-- Separators -->
		<div class="hidden tablet-sm:flex justify-center items-center">
			<span class="vr"></span>
		</div>

		<div class="tablet-sm:hidden justify-center items-center">
			<hr class="hr w-full tablet-sm:invisible" />
		</div>

		<!-- Stats Section -->
		<div class="user-stats flex flex-col justify-center w-full">
			<table class="w-full text-sm max-w-[400px]">
				<tbody>
				<tr>
					<td class="py-1 text-left">Performance Points</td>
					<td class="py-1 text-right font-bold">6000</td>
				</tr>
				<tr>
					<td class="py-1 text-left">Score</td>
					<td class="py-1 text-right font-bold">17,183,008,068</td>
				</tr>
				<tr>
					<td class="py-1 text-left">Hit Accuracy</td>
					<td class="py-1 text-right font-bold">99.29%</td>
				</tr>
				<tr>
					<td class="py-1 text-left">Play Count</td>
					<td class="py-1 text-right font-bold">1213</td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>
</ContentCard>
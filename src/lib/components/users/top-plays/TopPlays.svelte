<script lang="ts">
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { TrophyIcon } from 'lucide-svelte';
	import TopPlayCardSmall from '$lib/components/users/top-plays/TopPlayCardSmall.svelte';
	import TopPlayCardLarge from '$lib/components/users/top-plays/TopPlayCardLarge.svelte';
	import type { Play } from '$lib/models/play';

	let { topPlays }: { topPlays: Play[] } = $props();
</script>

<ContentCard
	sx="
		flex flex-col gap-1
		phone-sm:gap-3
		phone-lg:gap-4
		tablet-sm:gap-5
		tablet-lg:gap-6"
>
	<!-- Header -->
	<div
		class="
			flex items-center gap-1
			phone-sm:gap-3
			phone-lg:gap-4
			tablet-sm:gap-5
			tablet-lg:gap-6"
	>
		<TrophyIcon class="tablet-sm:size-8" />
		<h1 class="font-bold text-lg">Top Plays</h1>
	</div>

	<!-- Top Plays -->
	<div class="flex flex-col gap-1 phone-sm:gap-1.5">
		<!-- Small Screen -->
		<div class="tablet-sm:hidden flex flex-col gap-1 phone-sm:gap-1.5">
			{#each topPlays as topPlay, index (index)}
				<TopPlayCardSmall
					index={index}
					filename={topPlay.Filename}
					mods={topPlay.Mods}
					score={topPlay.MapScore}
					combo={topPlay.MapCombo}
					rank={topPlay.MapRank}
					miss={topPlay.MapMiss}
					accuracy={topPlay.MapAccuracy}
					pp={topPlay.MapPP}
				/>
			{/each}
		</div>

		<!-- Large Screen -->
		<div class="hidden tablet-sm:flex flex-col gap-2">
			{#each topPlays as topPlay, index (index)}
				<TopPlayCardLarge
					index={index}
					filename={topPlay.Filename}
					mods={topPlay.Mods}
					score={topPlay.MapScore}
					combo={topPlay.MapCombo}
					rank={topPlay.MapRank}
					miss={topPlay.MapMiss}
					accuracy={topPlay.MapAccuracy}
					pp={topPlay.MapPP}
				/>
			{/each}
		</div>
	</div>
</ContentCard>
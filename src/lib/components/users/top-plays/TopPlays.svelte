<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { TrophyIcon } from 'lucide-svelte';
	import TopPlayCardSmall from '$lib/components/users/top-plays/TopPlayCardSmall.svelte';
	import TopPlayCardLarge from '$lib/components/users/top-plays/TopPlayCardLarge.svelte';
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
		<TrophyIcon />
		<h1 class="font-bold text-lg">Top Plays</h1>
	</div>

	<!-- Top Plays -->
	<div class="flex flex-col gap-1 phone-sm:gap-1.5">
		<!-- Small Screen -->
		<div class="tablet-sm:hidden">
			<TopPlayCardSmall />
		</div>

		<!-- Large Screen -->
		<div class="hidden tablet-sm:block">
			<TopPlayCardLarge />
		</div>
	</div>
</ContentCard>
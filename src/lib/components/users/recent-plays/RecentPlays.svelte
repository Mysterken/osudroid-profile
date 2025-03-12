<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { Disc3Icon } from 'lucide-svelte';
	import RecentPlayCardSmall from '$lib/components/users/recent-plays/RecentPlayCardSmall.svelte';
	import RecentPlayCardLarge from '$lib/components/users/recent-plays/RecentPlayCardLarge.svelte';
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
		<Disc3Icon />
		<h1 class="font-bold text-lg">Recent Plays</h1>
	</div>

	<!-- Recent Plays -->
	<div class="flex flex-col gap-1 phone-sm:gap-1.5">
		<!-- Small Screen -->
		<div class="tablet-sm:hidden">
			<RecentPlayCardSmall />
		</div>

		<!-- Large Screen -->
		<div class="hidden tablet-sm:block">
			<RecentPlayCardLarge />
		</div>
	</div>
</ContentCard>
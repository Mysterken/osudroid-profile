<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { TrophyIcon } from 'lucide-svelte';
	import TopPlayCardSmall from '$lib/components/users/TopPlayCardSmall.svelte';
	import TopPlayCardLarge from '$lib/components/users/TopPlayCardLarge.svelte';
</script>

<ContentCard
	sx="
	flex flex-col
	gap-1
	phone-sm:gap-3
	phone-lg:gap-4
	tablet-sm:gap-5
	tablet-lg:gap-6"
>
	<div
		class="
		flex items-center
		gap-1
		phone-sm:gap-3
		phone-lg:gap-4
		tablet-sm:gap-5
		tablet-lg:gap-6"
	>
		<TrophyIcon />
		<h1 class="font-bold text-lg">Top Plays</h1>
	</div>
	<div
		class="flex flex-col gap-1 phone-sm:gap-1.5"
	>
		<TopPlayCardSmall />
		<TopPlayCardLarge />
	</div>
</ContentCard>
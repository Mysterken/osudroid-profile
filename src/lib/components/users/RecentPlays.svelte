<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { Disc3Icon } from 'lucide-svelte';
</script>

<ContentCard>
	<div
		class="
		flex items-center
		gap-1
		phone-sm:gap-3
		phone-lg:gap-4
		tablet-sm:gap-5
		tablet-lg:gap-6
"
	>
		<Disc3Icon/>
		<h1 class="font-bold text-lg">Recent Plays</h1>
	</div>
	<div>

	</div>
</ContentCard>
<script>
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
</script>

<ContentCard sx="user-info flex gap-4">
	<div class="user-avatar size-[80px] rounded-[10px] placeholder animate-pulse"></div>
	<div class="user-info flex flex-col justify-end text-left gap-1">
		<div class="placeholder animate-pulse h-5 w-28"></div>
		<div class="placeholder animate-pulse h-3.5 w-24"></div>
	</div>
</ContentCard>

<script>
import ContentCard from '$lib/components/layouts/ContentCard.svelte';
</script>

<ContentCard sx="user-info flex gap-4">
	<div class="user-avatar size-[80px] bg-[#FFFFFF] rounded-[10px] overflow-hidden">
		<img src="https://via.placeholder.com/150" alt="User Avatar" />
	</div>
	<div class="user-info flex flex-col justify-end text-left">
		<h1 class="font-bold text-lg">Username</h1>
		<p class="text-sm text-gray-400">Country</p>
	</div>
</ContentCard>
<script lang="ts">
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';

	let { avatarLink, username, country }:
		{ avatarLink: string; username: string; country: string; } = $props();

	function defaultAvatar(event: Event) {
		(event.target as HTMLInputElement).src = '/default/avatar.webp';
	}
</script>

<ContentCard sx="user-info flex gap-4">
	<div class="user-avatar size-[80px] bg-[#FFFFFF] rounded-[10px] overflow-hidden">
		<img src={avatarLink} onerror={defaultAvatar} alt="User Avatar" />
	</div>
	<div class="user-info flex flex-col justify-end text-left">
		<h1 class="font-bold text-lg">{username}</h1>
		<p class="text-sm text-gray-400"><span class="rounded-[2px] fi fi-{country} mr-2"></span>{country}</p>
	</div>
</ContentCard>
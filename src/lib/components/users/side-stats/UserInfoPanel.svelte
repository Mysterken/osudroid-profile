<script lang="ts">
	import ContentCard from '$lib/components/layouts/ContentCard.svelte';
	import { InfoIcon } from 'lucide-svelte';
	import { timeAgoStore, timestamp } from '$lib/stores/timeAgo';


	let { registered, lastLogin }:
		{ registered: string | null; lastLogin: string | null; } = $props();

	let formattedRegistered = registered ? new Date(registered).toLocaleDateString() : 'N/A';

	$effect(() => {
		timestamp.set(lastLogin);
	});
</script>

<ContentCard sx="!p-2.5 flex flex-col gap-2.5">
	<div class="flex items-center gap-3.5">
		<InfoIcon class="size-8" />
		<h1 class="font-bold text-lg">User Info</h1>
	</div>
	<div class="user-info flex flex-col justify-center w-full px-2">
		<table class="w-full text-sm max-w-[400px]">
			<tbody>
			<tr>
				<td class="pb-1 text-left">Registered</td>
				<td class="pb-1 text-right font-bold">{formattedRegistered}</td>
			</tr>
			<tr>
				<td class="pb-1 text-left">Last Login</td>
				<td class="pb-1 text-right font-bold">{$timeAgoStore}</td>
			</tr>
			</tbody>
		</table>
	</div>
</ContentCard>
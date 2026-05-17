<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface FilterOption {
		value: string;
		label: string;
	}

	export interface FilterDef {
		id: string;
		label: string;
		value: string;
		options: FilterOption[];
		onChange: (value: string) => void;
	}

	interface Props {
		filters: FilterDef[];
		extra?: Snippet;
	}

	let { filters, extra }: Props = $props();
</script>

{#snippet selectField(filter: FilterDef)}
	<div class="flex-1">
		<label for={filter.id} class="block text-sm font-semibold text-gray-400 mb-2">
			{filter.label}
		</label>
		<select
			id={filter.id}
			value={filter.value}
			onchange={(e) => filter.onChange((e.target as HTMLSelectElement).value)}
			class="select w-full bg-[#3D3D3D] border-gray-600 focus:border-pink-600 focus:ring-pink-600 rounded-xl"
		>
			{#each filter.options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
{/snippet}

<div
	class="bg-[#2A2A2A] rounded-2xl p-4 tablet-sm:p-6 flex flex-col tablet-sm:flex-row gap-4 tablet-sm:gap-6"
>
	{#each filters as filter (filter.id)}
		{@render selectField(filter)}
	{/each}
	{#if extra}
		{@render extra()}
	{/if}
</div>

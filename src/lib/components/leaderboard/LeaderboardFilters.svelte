<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getLeaderboardCountries } from '$lib/utils/countries';

	type RankingType = 'pp' | 'score';

	interface Props {
		rankingType: RankingType;
		selectedCountry: string;
		onFilterChange: (type: RankingType, country: string) => void;
	}

	let {
		rankingType = $bindable(),
		selectedCountry = $bindable(),
		onFilterChange
	}: Props = $props();

	const rankingTypes: ReadonlyArray<{ value: RankingType; label: string }> = [
		{ value: 'pp', label: 'PP Ranking' },
		{ value: 'score', label: 'Score Ranking' }
	];

	const countries = getLeaderboardCountries();

	function handleRankingTypeChange(event: Event) {
		rankingType = (event.target as HTMLSelectElement).value as RankingType;
		onFilterChange(rankingType, selectedCountry);
	}

	function handleCountryChange(event: Event) {
		selectedCountry = (event.target as HTMLSelectElement).value;
		onFilterChange(rankingType, selectedCountry);
	}
</script>

{#snippet selectField(
	id: string,
	label: string,
	value: string,
	onchange: (e: Event) => void,
	children: Snippet
)}
	<div class="flex-1">
		<label for={id} class="block text-sm font-semibold text-gray-400 mb-2">
			{label}
		</label>
		<div class="relative">
			<select
				{id}
				{value}
				{onchange}
				class="select w-full bg-[#3D3D3D] border-gray-600 focus:border-pink-600 focus:ring-pink-600 rounded-xl"
			>
				{@render children()}
			</select>
		</div>
	</div>
{/snippet}

<div class="
	bg-[#2A2A2A] rounded-2xl p-4 tablet-sm:p-6
	flex flex-col tablet-sm:flex-row gap-4 tablet-sm:gap-6
">
	{#snippet rankingOptions()}
		{#each rankingTypes as type (type.value)}
			<option value={type.value}>{type.label}</option>
		{/each}
	{/snippet}

	{#snippet countryOptions()}
		{#each countries as country (country.code)}
			<option value={country.code}>{country.name}</option>
		{/each}
	{/snippet}

	{@render selectField('ranking-type', 'Ranking Type', rankingType, handleRankingTypeChange, rankingOptions)}
	{@render selectField('country-filter', 'Country Filter', selectedCountry, handleCountryChange, countryOptions)}
</div>
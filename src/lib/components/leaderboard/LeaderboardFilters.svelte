<script lang="ts">

	interface Props {
		rankingType: 'pp' | 'score';
		selectedCountry: string;
		onFilterChange: (type: typeof rankingType, country: string) => void;
	}

	interface Country {
		code: string;
		name: string;
	}

	let { rankingType = $bindable(), selectedCountry = $bindable(), onFilterChange }: Props = $props();

	const rankingTypes = [
		{ value: 'pp', label: 'PP Ranking' },
		{ value: 'score', label: 'Score Ranking' }
	] as const;

	const countries: Country[] = [
		{ code: 'all', name: 'All' },
		{ code: 'AU', name: 'Australia' },
		{ code: 'FR', name: 'France' },
		{ code: 'DE', name: 'Germany' },
		{ code: 'ID', name: 'Indonesia' },
		{ code: 'MY', name: 'Malaysia' },
		{ code: 'SG', name: 'Singapore' },
		{ code: 'KR', name: 'South Korea' },
		{ code: 'SE', name: 'Sweden' },
		{ code: 'GB', name: 'United Kingdom' },
		{ code: 'US', name: 'United States' },
		{ code: 'DZ', name: 'Algeria' },
		{ code: 'AR', name: 'Argentina' },
		{ code: 'AT', name: 'Austria' },
		{ code: 'AZ', name: 'Azerbaijan' },
		{ code: 'BH', name: 'Bahrain' },
		{ code: 'BD', name: 'Bangladesh' },
		{ code: 'BB', name: 'Barbados' },
		{ code: 'BY', name: 'Belarus' },
		{ code: 'BE', name: 'Belgium' },
		{ code: 'BT', name: 'Bhutan' },
		{ code: 'BW', name: 'Botswana' },
		{ code: 'BR', name: 'Brazil' },
		{ code: 'BN', name: 'Brunei' },
		{ code: 'BG', name: 'Bulgaria' },
		{ code: 'KH', name: 'Cambodia' },
		{ code: 'CA', name: 'Canada' },
		{ code: 'CL', name: 'Chile' },
		{ code: 'CN', name: 'China' },
		{ code: 'CO', name: 'Colombia' },
		{ code: 'CR', name: 'Costa Rica' },
		{ code: 'CI', name: 'Cote D\'Ivoire' },
		{ code: 'HR', name: 'Croatia' },
		{ code: 'CU', name: 'Cuba' },
		{ code: 'CW', name: 'Curaçao' },
		{ code: 'CY', name: 'Cyprus' },
		{ code: 'CZ', name: 'Czech Republic' },
		{ code: 'DK', name: 'Denmark' },
		{ code: 'DJ', name: 'Djibouti' },
		{ code: 'EC', name: 'Ecuador' },
		{ code: 'EG', name: 'Egypt' },
		{ code: 'SV', name: 'El Salvador' },
		{ code: 'EE', name: 'Estonia' },
		{ code: 'ET', name: 'Ethiopia' },
		{ code: 'FJ', name: 'Fiji' },
		{ code: 'FI', name: 'Finland' },
		{ code: 'GA', name: 'Gabon' },
		{ code: 'GH', name: 'Ghana' },
		{ code: 'GR', name: 'Greece' },
		{ code: 'GU', name: 'Guam' },
		{ code: 'HN', name: 'Honduras' },
		{ code: 'HK', name: 'Hong Kong' },
		{ code: 'HU', name: 'Hungary' },
		{ code: 'IS', name: 'Iceland' },
		{ code: 'IN', name: 'India' },
		{ code: 'IR', name: 'Iran, Islamic Republic of' },
		{ code: 'IQ', name: 'Iraq' },
		{ code: 'IE', name: 'Ireland' },
		{ code: 'IL', name: 'Israel' },
		{ code: 'IT', name: 'Italy' },
		{ code: 'JM', name: 'Jamaica' },
		{ code: 'JP', name: 'Japan' },
		{ code: 'JO', name: 'Jordan' },
		{ code: 'KE', name: 'Kenya' },
		{ code: 'XK', name: 'Kosovo' },
		{ code: 'KW', name: 'Kuwait' },
		{ code: 'LV', name: 'Latvia' },
		{ code: 'LI', name: 'Liechtenstein' },
		{ code: 'LT', name: 'Lithuania' },
		{ code: 'LU', name: 'Luxembourg' },
		{ code: 'MG', name: 'Madagascar' },
		{ code: 'MV', name: 'Maldives' },
		{ code: 'MT', name: 'Malta' },
		{ code: 'MU', name: 'Mauritius' },
		{ code: 'MX', name: 'Mexico' },
		{ code: 'MC', name: 'Monaco' },
		{ code: 'MN', name: 'Mongolia' },
		{ code: 'MA', name: 'Morocco' },
		{ code: 'MM', name: 'Myanmar' },
		{ code: 'NP', name: 'Nepal' },
		{ code: 'NL', name: 'Netherlands' },
		{ code: 'NC', name: 'New Caledonia' },
		{ code: 'NZ', name: 'New Zealand' },
		{ code: 'NG', name: 'Nigeria' },
		{ code: 'MK', name: 'North Macedonia' },
		{ code: 'NO', name: 'Norway' },
		{ code: 'OM', name: 'Oman' },
		{ code: 'PK', name: 'Pakistan' },
		{ code: 'PA', name: 'Panama' },
		{ code: 'PG', name: 'Papua New Guinea' },
		{ code: 'PY', name: 'Paraguay' },
		{ code: 'PE', name: 'Peru' },
		{ code: 'PH', name: 'Philippines' },
		{ code: 'PL', name: 'Poland' },
		{ code: 'PT', name: 'Portugal' },
		{ code: 'QA', name: 'Qatar' },
		{ code: 'RO', name: 'Romania' },
		{ code: 'RU', name: 'Russian Federation' },
		{ code: 'SA', name: 'Saudi Arabia' },
		{ code: 'SN', name: 'Senegal' },
		{ code: 'SL', name: 'Sierra Leone' },
		{ code: 'SK', name: 'Slovakia' },
		{ code: 'SI', name: 'Slovenia' },
		{ code: 'ZA', name: 'South Africa' },
		{ code: 'ES', name: 'Spain' },
		{ code: 'LK', name: 'Sri Lanka' },
		{ code: 'SD', name: 'Sudan' },
		{ code: 'CH', name: 'Switzerland' },
		{ code: 'SY', name: 'Syrian Arab Republic' },
		{ code: 'TW', name: 'Taiwan' },
		{ code: 'TZ', name: 'Tanzania, United Republic of' },
		{ code: 'TH', name: 'Thailand' },
		{ code: 'TG', name: 'Togo' },
		{ code: 'TT', name: 'Trinidad and Tobago' },
		{ code: 'TN', name: 'Tunisia' },
		{ code: 'TR', name: 'Turkey' },
		{ code: 'UA', name: 'Ukraine' },
		{ code: 'AE', name: 'United Arab Emirates' },
		{ code: 'UY', name: 'Uruguay' },
		{ code: 'VE', name: 'Venezuela' },
		{ code: 'VN', name: 'Vietnam' },
		{ code: 'ZW', name: 'Zimbabwe' }
	];

	function handleRankingTypeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		rankingType = target.value as typeof rankingType;
		onFilterChange(rankingType, selectedCountry);
	}

	function handleCountryChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedCountry = target.value;
		onFilterChange(rankingType, selectedCountry);
	}
</script>

<div class="
	bg-[#2A2A2A] rounded-2xl p-4 tablet-sm:p-6
	flex flex-col tablet-sm:flex-row gap-4 tablet-sm:gap-6
">
	<div class="flex-1">
		<label for="ranking-type" class="block text-sm font-semibold text-gray-400 mb-2">
			Ranking Type
		</label>
		<div class="relative">
			<select
				id="ranking-type"
				onchange={handleRankingTypeChange}
				class="select w-full bg-[#3D3D3D] border-gray-600 focus:border-pink-600 focus:ring-pink-600 rounded-xl"
			>
				{#each rankingTypes as type (type.value)}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="flex-1">
		<label for="country-filter" class="block text-sm font-semibold text-gray-400 mb-2">
			Country Filter
		</label>
		<div class="relative">
			<select
				id="country-filter"
				onchange={handleCountryChange}
				class="select w-full bg-[#3D3D3D] border-gray-600 focus:border-pink-600 focus:ring-pink-600 rounded-xl"
			>
				{#each countries as country (country.code)}
					<option value={country.code}>{country.name}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
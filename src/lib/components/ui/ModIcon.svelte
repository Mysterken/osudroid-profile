<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { playUtils } from '$lib/utils/playUtils';

	let { mod, size = 24, length = 1 }: { mod: string; size?: number; length?: number } = $props();

	let imgSrc = `/modicons/${mod}.webp`;
	let modName = playUtils.convertAliasToLongModName(mod);

	const supportedMods = [
		'AP', 'AT', 'CM', 'DT', 'EZ',
		'FL', 'HD', 'HF', 'HR', 'HT',
		'NC', 'NF', 'PF', 'PR', 'RX',
		'SD', 'SO', 'TD', 'TP', 'NM',
		'None'
	];

	function shouldDisplayModIcon(mod: string): boolean {
		return supportedMods.includes(mod) && !mod.startsWith('x');
	}
</script>

{#if shouldDisplayModIcon(mod)}
	<img class=" h-auto object-contain" src={imgSrc} alt={`${mod} mod icon`} style="max-width: {size}px"
			 use:tooltip={{text: modName}} />
{/if}

{#if mod.startsWith('x')}
	<div
		class="
		flex items-center justify-center
		bg-[#1e1e1e]
		border-[#3C3C3C] border-[1px] rounded-[5px]
		text-white text-xs font-bold
		px-2 {length > 1 ? 'ml-2' : ''}"
	>
		{mod}
	</div>
{/if}

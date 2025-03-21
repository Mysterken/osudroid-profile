<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import { playUtils } from '$lib/utils/playUtils';

	let { mod, size = 24 }: { mod: string; size?: number } = $props();

	let imgSrc = `/modicons/${mod}.webp`;
	let modName = playUtils.convertAliasToLongModName(mod);

	function shouldDisplayModIcon(mod: string): boolean {
		return !(mod === 'NM' || mod === 'None' || mod.startsWith('x'));
	}
</script>

{#if shouldDisplayModIcon(mod)}
	<img class=" h-auto object-contain" src={imgSrc} alt={`${mod} mod icon`} style="max-width: {size}px"
			 use:tooltip={{text: modName}} />
{/if}

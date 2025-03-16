<script lang="ts">
	let { mod, size = 24 }: { mod: string; size?: number } = $props();

	let imgSrc = `/modicons/${mod}.png`;

	function shouldDisplayModIcon(mod: string): boolean {
		return !(mod === "NM" || mod === "None" || mod.startsWith("x"));
	}
</script>

{#if shouldDisplayModIcon(mod)}
	<img class=" h-auto object-contain" src={imgSrc} alt={`${mod} mod icon`} style="max-width: {size}px" />
{/if}

<script lang="ts">
	let { sx, rank }: { sx: string; rank: string } = $props();
	let letterRank = $derived(rank?.toUpperCase());

	function getRankColor(rank: string): { color: string; displayLetter: string } {
		const rankMap: Record<string, { color: string; displayLetter: string }> = {
			XH: { color: '#FFFFFF', displayLetter: 'SS' },
			SH: { color: '#FFFFFF', displayLetter: 'S' },
			X: { color: '#FFFF00', displayLetter: 'SS' },
			SS: { color: '#FFFF00', displayLetter: 'SS' },
			S: { color: '#FFFF00', displayLetter: 'S' },
			A: { color: '#008000', displayLetter: 'A' },
			B: { color: '#0000FF', displayLetter: 'B' },
			C: { color: '#800080', displayLetter: 'C' },
			D: { color: '#800020', displayLetter: 'D' }
		};
		return rankMap[rank] || { color: '#FFFFFF', displayLetter: rank };
	}

	const { color, displayLetter } = $derived(getRankColor(letterRank));
</script>

<div class={sx} style="color: {color};">
	{displayLetter}
</div>

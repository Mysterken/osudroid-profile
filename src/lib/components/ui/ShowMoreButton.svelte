<script lang="ts">
	let { steps = [5, 25, 50], totalItems = 50, itemsToShow = $bindable(5) } = $props();
	let currentStep = $state(0);

	function showMore() {
		if (currentStep < steps.length - 1) {
			currentStep += 1;
		}
	}

	$effect(() => {
		itemsToShow = steps[currentStep];
	});
</script>

{#if itemsToShow < totalItems}
	<div class="flex justify-center mt-2">
		<button type="button" class="text-sm font-bold btn preset-filled" onclick={showMore}>
			Show More
		</button>
	</div>
{/if}

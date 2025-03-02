<script lang="ts">
	let { children } = $props();
</script>

<div
	class="
	bg-[#1E1E1E]
	flex flex-col
	max-w-[1240px]
	mx-auto
	phone-sm:gap-2.5
	phone-sm:py-2.5
	phone-lg:gap-3.5
	phone-lg:py-3.5
	tablet-sm:gap-5
	tablet-sm:p-5
	tablet-lg:gap-6
	tablet-lg:p-6
	desktop-sm:gap-8
	desktop-sm:p-8
	desktop-lg:gap-8
	desktop-lg:p-8"
>
	{@render children?.()}
</div>
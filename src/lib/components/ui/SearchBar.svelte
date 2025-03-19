<script lang="ts">
	import { Search } from 'lucide-svelte';
</script>

<nav
	class="
	bg-[#2A2A2A]
	sticky top-0 z-50
	flex flex-col
	justify-center
	p-2
	phone-sm:p-2.5
	tablet-sm:p-3.5
	desktop-sm:px-6
	desktop-sm:py-4
	my-auto
	phone-sm:h16
	tablet-sm:h-20
	h-16
"
>
	<div class="max-w-[1200px] mx-auto size-full">
		<div class="input-group grid-cols-[auto_1fr_auto] size-full max-w-3xl bg-[#565656] rounded-[10px]">
			<div class="ig-cell preset-tonal">
				<Search size={16} />
			</div>
			<input class="ig-input text-white shadow-inner" type="search" placeholder="Search player..." />
		</div>
	</div>
</nav>
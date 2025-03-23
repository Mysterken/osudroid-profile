<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer
	class="
		bg-[#2A2A2A]
		text-gray-400 text-sm
		flex flex-col items-center justify-center
		py-4
		border-t border-[#3C3C3C]
	"
>
	<p>&copy; {year} osudroid-profile.</p>

	<div class="flex flex-row mt-2 gap-10">
		<a
			href="https://github.com/Mysterken/osudroid-profile"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-1 text-blue-400 hover:underline hover:text-blue-300"
		>
			<img src="/icons/github.svg" class="size-4 invert" alt="github icon" />
			<span>View on GitHub</span>
		</a>
	</div>

</footer>

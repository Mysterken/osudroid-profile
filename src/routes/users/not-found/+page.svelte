<script>
	import UserNotFound from '$lib/components/users/not-found/UserNotFound.svelte';
	import ContentLayout from '$lib/components/layouts/ContentLayout.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
</script>

<svelte:head>
	<title>User Not Found - osu!droid</title>
	<meta property="og:title" content="User Not Found - osu!droid" />
	<meta property="og:description" content="User not found on osu!droid." />
</svelte:head>

<SearchBar />

<ContentLayout>
	<UserNotFound />
</ContentLayout>

<Footer />

import { derived, writable } from "svelte/store";

function timeAgo(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	const intervals = [
		{ unit: "year", seconds: 31536000 },
		{ unit: "month", seconds: 2592000 },
		{ unit: "week", seconds: 604800 },
		{ unit: "day", seconds: 86400 },
		{ unit: "hour", seconds: 3600 },
		{ unit: "minute", seconds: 60 },
		{ unit: "second", seconds: 1 },
	];

	for (const { unit, seconds } of intervals) {
		const interval = Math.floor(diffInSeconds / seconds);
		if (interval >= 1) return rtf.format(-interval, unit);
	}

	return "just now";
}

export const timestamp = writable<string | null>(null);

export const timeAgoStore = derived(timestamp, ($timestamp) =>
	$timestamp ? timeAgo($timestamp) : "unknown"
);
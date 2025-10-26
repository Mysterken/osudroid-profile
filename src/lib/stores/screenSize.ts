import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function getScreenSizeInRem(): number {
	if (!browser) return 0; // Return default value during SSR
	const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
	return window.innerWidth / rootFontSize;
}

export const screenSize = writable(getScreenSizeInRem());

export const breakpoints = {
	phoneSm: 22.5,
	phoneLg: 30,
	tabletSm: 48,
	tabletLg: 64,
	desktopSm: 80,
	desktopLg: 90
};

if (browser) {
	function updateScreenSize() {
		screenSize.set(getScreenSizeInRem());
	}

	window.addEventListener('resize', updateScreenSize);
}

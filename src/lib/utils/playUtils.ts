/**
 * Function to calculate raw PP
 * Formula: Total PP = p * 0.95^(n-1)
 */
function calculateRawPP(pp: number | null, index: number): number {
	if (!pp) return 0;
	return pp * Math.pow(0.95, index - 1);
}

/**
 * Extracts play details from a string.
 * Matches values for date, score, mods, combo, and accuracy.
 */
function convertStringIntoPlayDetails(text: string) {
	const dateMatch = text.match(/\d{4}-\d{2}-\d{2} (\d|:)+/);
	const scoreMatch = text.match(/(?<=score: )([\d,]+)/);
	const longModsMatch = text.match(/(?<=mod: )([\w., ]+)/);
	const comboMatch = text.match(/(?<=combo: )(\d+)/);
	const accuracyMatch = text.match(/(?<=accuracy: )([\d.]+)/);

	// Extract values, ensuring defaults in case of missing data
	const date = dateMatch ? dateMatch[0] : null;
	const score = scoreMatch ? parseInt(scoreMatch[0].replace(/,/g, ""), 10) : 0;
	const combo = comboMatch ? parseInt(comboMatch[0], 10) : 0;
	const accuracy = accuracyMatch ? parseFloat(accuracyMatch[0]) : 0.0;

	let mods: string[] = ["NM"]; // Default to "NM" if no mods are found
	if (longModsMatch) {
		mods = longModsMatch[0]
			.split(", ")
			.filter(Boolean) // Remove empty values
			.map(convertLongModNameToAlias);
	}

	return {
		date,
		score,
		mods,
		combo,
		accuracy,
	};
}

/**
 * Converts long mod names to their alias.
 * Example: "NoFail" → "NF"
 */
function convertLongModNameToAlias(mod: string): string {
	const modMapping: Record<string, string> = {
		"Precise": "PR",
		"NoFail": "NF",
		"Easy": "EZ",
		"Hidden": "HD",
		"HardRock": "HR",
		"DoubleTime": "DT",
		"HalfTime": "HT",
		"NightCore": "NC",
		"Flashlight": "FL",
		"Relax": "RX",
		"Autopilot": "AP",
		"SpunOut": "SO",
		"Perfect": "PF",
		"SuddenDeath": "SD",
	};

	if (mod === "None") return "NM"; // Default to No Mod (NM)
	if (mod.startsWith("x")) return mod; // Speed multipliers (e.g., x1.10)

	return modMapping[mod] || mod; // Default to original if not mapped
}

/**
 * Converts a beatmap title string into structured metadata.
 *
 * Example input:
 * "EGOIST - Ame, Kimi o Tsurete(Speed up ver.) (xAsuna) [Pedri]"
 *
 * Expected output:
 * {
 *   songArtist: "EGOIST",
 *   songTitle: "Ame, Kimi o Tsurete(Speed up ver.)",
 *   mapper: "xAsuna",
 *   difficulty: "Pedri"
 * }
 */
export function convertTitleToBeatmapMetadata(title: string): {
	songArtist: string;
	songTitle: string;
	mapper: string;
	difficulty: string;
} {
	// Helper function to escape regex special characters
	function escapeRegExp(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	let songArtist = "";
	const songArtistMatch = title.match(/^(.*?) - /);
	if (songArtistMatch) {
		songArtist = songArtistMatch[1];
		// Remove the matched artist portion from the title
		title = title.replace(new RegExp(escapeRegExp(songArtistMatch[0]), "g"), "");
	}

	let difficulty = "";
	const strippedTitleMatch = title.match(/.*?\) (?=\[)/);
	if (strippedTitleMatch) {
		const strippedTitle = strippedTitleMatch[0];
		// Remove the strippedTitle from the title to get difficulty part
		difficulty = title.replace(new RegExp(escapeRegExp(strippedTitle), "g"), "");
		title = title.replace(new RegExp(escapeRegExp(difficulty), "g"), "");
	}

	let songTitle = "";
	const songTitleMatch = title.match(/.*(?= \()/);
	if (songTitleMatch) {
		songTitle = songTitleMatch[0];
		title = title.replace(new RegExp(escapeRegExp(songTitle), "g"), "");
	}

	let mapper = "";
	const mapperMatch = title.match(/(?<= \().*(?=\))/);
	if (mapperMatch) {
		mapper = mapperMatch[0];
	}

	// Remove surrounding brackets from difficulty (e.g., "[Pedri]" -> "Pedri")
	if (difficulty.startsWith("[") && difficulty.endsWith("]")) {
		difficulty = difficulty.substring(1, difficulty.length - 1);
	}

	return {
		songArtist,
		songTitle,
		mapper,
		difficulty,
	};
}

export const playUtils = {
	calculateRawPP,
	convertStringIntoPlayDetails,
	convertLongModNameToAlias,
	convertTitleToBeatmapMetadata
};



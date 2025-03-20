export interface Beatmap {
	beatmapset_id: number;
	difficulty_rating: number;
	id: number;
	mode: "osu" | "taiko" | "catch" | "mania";
	status: -2 | -1 | 0 | 1 | 2 | 3 | 4; // Matches integer rank status
	total_length: number;
	user_id: number;
	version: string;

	beatmapset?: Beatmapset | BeatmapsetExtended | null;
	checksum?: string;
	failtimes?: Failtimes;
	max_combo?: number;
	owners?: BeatmapOwner[];
}

export interface BeatmapExtended extends Beatmap {
	accuracy: number;
	ar: number;
	bpm?: number | null;
	convert: boolean;
	count_circles: number;
	count_sliders: number;
	count_spinners: number;
	cs: number;
	deleted_at?: string | null;
	drain: number;
	hit_length: number;
	is_scoreable: boolean;
	last_updated: string;
	mode_int: number;
	passcount: number;
	playcount: number;
	ranked: -2 | -1 | 0 | 1 | 2 | 3 | 4;
	url: string;
}

export interface Beatmapset {
	id: number;
	artist: string;
	artist_unicode: string;
	covers: Covers;
	creator: string;
	favourite_count: number;
	nsfw: boolean;
	offset: number;
	play_count: number;
	preview_url: string;
	source: string;
	status: -2 | -1 | 0 | 1 | 2 | 3 | 4;
	spotlight: boolean;
	title: string;
	title_unicode: string;
	user_id: number;
	video: boolean;

	beatmaps?: (Beatmap | BeatmapExtended)[];
	converts?: Beatmap[];
	current_nominations?: Nomination[];
	current_user_attributes?: unknown;
	description?: string;
	discussions?: unknown;
	events?: unknown;
	genre?: string;
	has_favourited?: boolean;
	language?: string;
	nominations?: unknown;
	pack_tags?: string[];
	ratings?: number[];
	recent_favourites?: unknown;
	related_users?: unknown;
	user?: unknown;
	track_id?: number | null;
	can_be_hyped?: boolean;
	deleted_at?: string | null;
	discussion_enabled?: boolean;
	discussion_locked?: boolean;
	is_scoreable?: boolean;
	last_updated: string;
	legacy_thread_url?: string;
	nominations_summary?: NominationsSummary;
	ranked_date?: string;
	storyboard?: boolean;
	submitted_date?: string;
	tags?: string;
	availability?: Availability;
}

export interface BeatmapsetExtended extends Beatmapset {
	hype?: { current: number; required: number };
}

// Owner (Mapper) Information
export interface BeatmapOwner {
	id: number;
	username: string; // If the user is deleted, API returns "[deleted user]"
}

// Covers for beatmapset
export interface Covers {
	cover: string;
	"cover@2x": string;
	card: string;
	"card@2x": string;
	list: string;
	"list@2x": string;
	slimcover: string;
	"slimcover@2x": string;
}

// Failtimes for a beatmap
export interface Failtimes {
	fail?: number[] | null; // Array of length 100
	exit?: number[] | null; // Array of length 100
}

// Nominations Summary
export interface NominationsSummary {
	current: number;
	eligible_main_rulesets?: string[];
	required_meta?: RequiredMeta;
	required?: number; // Added missing field
}

// Required meta information for nominations
export interface RequiredMeta {
	main_ruleset: number;
	non_main_ruleset: number;
}

// Availability settings
export interface Availability {
	download_disabled: boolean;
	more_information?: string | null;
}

// Nomination Object
export interface Nomination {
	user_id: number;
	rulesets: string[];
}

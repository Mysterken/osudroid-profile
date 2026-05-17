export interface BeatmapScore {
	id: number;
	uid: number;
	username: string;
	filename: string;
	score: number;
	combo: number;
	mark: string;
	mode: string;
	mods: Array<{ acronym: string; settings?: Record<string, unknown> }>;
	accuracy: number;
	perfect: number;
	geki: number;
	good: number;
	katu: number;
	bad: number;
	miss: number;
	sliderHeadHit: number;
	sliderTickHit: number;
	sliderRepeatHit: number;
	sliderEndHit: number;
	date: number;
	hash: string;
	pp: number;
	ppMultiplier: number;
}

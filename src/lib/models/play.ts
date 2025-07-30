import { playUtils } from '$lib/utils/playUtils';

export interface Play {
	Filename: string;
	Mods: (string | { acronym: string })[];
	MapScore: number;
	MapCombo: number;
	MapRank: string;
	MapMiss: number;
	MapAccuracy: number;
	MapPP: number | null;
	PlayedDate?: string;
	Hash?: string;
}

export interface ApiPlay extends Play {
	ScoreId: number;
	MapGeki: number;
	MapPerfect: number;
	MapKatu: number;
	MapGood: number;
	MapBad: number;
	PlayedDate: string;
}

export interface ScraperPlay extends Play {
	Hash: string;
}

export interface ScraperPlayData {
	rank: string;
	title: string;
	date: string;
	pp: number;
	score: number;
	mod: string;
	combo: number;
	accuracy: number;
	miss: number;
	hash: string;
}

export interface MergedPlay extends Play {
	ScoreId: number;
	MapGeki: number;
	MapPerfect: number;
	MapKatu: number;
	MapGood: number;
	MapBad: number;
	PlayedDate: string;
	Hash?: string;
}

export function mergePlays(api: ApiPlay, scraper?: ScraperPlay): MergedPlay {
	return {
		...api,
		Hash: scraper?.Hash
	};
}

export function parsePlayFromApi(data: ApiPlay): ApiPlay {
	const mods = Array.isArray(data.Mods)
		? (data.Mods as (string | { acronym: string; settings?: Record<string, any> })[]).map((mod) => {
				if (typeof mod === 'object' && mod !== null) {
					const acronym = mod.acronym;
					if (acronym === 'CS') {
						if (mod.settings && typeof mod.settings === 'object') {
							const settingValues = Object.values(mod.settings);
							return 'x' + settingValues.map(String).join('');
						}
						return 'x';
					}
					if (mod.settings && typeof mod.settings === 'object') {
						const settingValues = Object.values(mod.settings);
						return acronym + settingValues.map(String).join('');
					}
					return acronym;
				}
				if (typeof mod === 'string' && mod.startsWith('CS')) {
					const value = mod.slice(2);
					return value ? 'x' + value : 'x';
				}
				return mod;
			})
		: [];

	// Move all mods starting with 'x' to the end
	const xMods = mods.filter((m) => typeof m === 'string' && m.startsWith('x'));
	const otherMods = mods.filter((m) => !(typeof m === 'string' && m.startsWith('x')));
	const orderedMods = [...otherMods, ...xMods];

	return {
		...data,
		Mods: orderedMods,
		MapPP: data.MapPP !== null ? data.MapPP : null
	};
}

export function parsePlayFromScraper(data: ScraperPlayData): ScraperPlay {
	return {
		Filename: data.title,
		Mods: data.mod.split(', ').map(playUtils.convertLongModNameToAlias),
		MapScore: data.score,
		MapCombo: data.combo,
		MapRank: data.rank,
		MapMiss: data.miss,
		MapAccuracy: data.accuracy / 100,
		MapPP: data.pp,
		Hash: data.hash
	};
}

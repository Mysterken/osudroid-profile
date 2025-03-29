import { playUtils } from '$lib/utils/playUtils';

export interface Play {
	Filename: string;
	Mods: string[];
	MapScore: number;
	MapCombo: number;
	MapRank: string;
	MapMiss: number;
	MapAccuracy: number;
	MapPP: number | null;
	PlayedDate?: string;
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
	return {
		...data,
		Mods: Array.isArray(data.Mods) ? data.Mods : [],
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
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

export function parsePlayFromApi(data: ApiPlay): ApiPlay {
	return {
		ScoreId: data.ScoreId,
		Filename: data.Filename,
		Mods: Array.isArray(data.Mods) ? data.Mods : [],
		MapScore: data.MapScore,
		MapCombo: data.MapCombo,
		MapRank: data.MapRank,
		MapGeki: data.MapGeki,
		MapPerfect: data.MapPerfect,
		MapKatu: data.MapKatu,
		MapGood: data.MapGood,
		MapBad: data.MapBad,
		MapMiss: data.MapMiss,
		MapAccuracy: data.MapAccuracy,
		MapPP: data.MapPP !== null ? data.MapPP : null,
		PlayedDate: data.PlayedDate,
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
		MapAccuracy: data.accuracy,
		MapPP: data.pp,
		Hash: data.hash,
	};
}
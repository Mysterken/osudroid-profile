import {
	type ApiPlay,
	parsePlayFromApi,
	parsePlayFromScraper,
	type Play,
	type ScraperPlay,
	type ScraperPlayData
} from '$lib/models/play';

export interface BasePlayer {
	UserId: number;
	Username: string;
	OverallScore: number;
	OverallPP: number;
	OverallPlaycount: number;
	OverallAccuracy: number;
	Region: string;
	Top50Plays: Play[];
	Last50Scores: Play[];
}

export interface ApiPlayer extends BasePlayer {
	GlobalRank: number;
	CountryRank: number;
	Registered: string;
	LastLogin: string;
	Supporter: boolean;
	CoreDeveloper: boolean;
	Developer: boolean;
	Contributor: boolean;
	Top50Plays: ApiPlay[];
	Last50Scores: ApiPlay[];
}

export interface ScraperPlayer extends BasePlayer {
	ScoreRank: number;
	PPRank: number;
	Top50Plays: ScraperPlay[];
	Last50Scores: ScraperPlay[];
}

interface ScraperData {
	uid: number;
	username: string;
	location: string;
	scoreRank: number;
	ppRank: number;
	rankedScore: number;
	performancePoints: number;
	hitAccuracy: number;
	playcount: number;
	topPlays: ScraperPlayData[];
	recentPlays: ScraperPlayData[];
}

export function parsePlayerFromApi(data: ApiPlayer): ApiPlayer {
	return {
		UserId: data.UserId,
		Username: data.Username,
		GlobalRank: data.GlobalRank,
		CountryRank: data.CountryRank,
		OverallScore: data.OverallScore,
		OverallPP: data.OverallPP,
		OverallPlaycount: data.OverallPlaycount,
		OverallAccuracy: data.OverallAccuracy,
		Registered: data.Registered,
		LastLogin: data.LastLogin,
		Supporter: data.Supporter,
		CoreDeveloper: data.CoreDeveloper,
		Developer: data.Developer,
		Contributor: data.Contributor,
		Region: data.Region,
		Top50Plays: data.Top50Plays.map(parsePlayFromApi),
		Last50Scores: data.Last50Scores?.map(parsePlayFromApi) ?? []
	};
}

export function parsePlayerFromScraper(data: ScraperData): ScraperPlayer {
	return {
		UserId: data.uid,
		Username: data.username,
		OverallScore: data.rankedScore,
		OverallPP: data.performancePoints,
		OverallPlaycount: data.playcount,
		OverallAccuracy: data.hitAccuracy,
		Region: data.location,
		Top50Plays: data.topPlays.map(parsePlayFromScraper),
		Last50Scores: data.recentPlays.map(parsePlayFromScraper),
		ScoreRank: data.scoreRank,
		PPRank: data.ppRank
	};
}

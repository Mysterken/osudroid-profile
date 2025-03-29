import {
	type ApiPlay,
	type MergedPlay,
	mergePlays,
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
	Source: 'api' | 'scraper' | 'merged';
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
	Source: 'api';
}

export interface ScraperPlayer extends BasePlayer {
	ScoreRank: number;
	PPRank: number;
	Top50Plays: ScraperPlay[];
	Last50Scores: ScraperPlay[];
	Source: 'scraper';
}

interface ScraperPlayerData {
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

export interface MergedPlayer extends BasePlayer {
	GlobalRank: number;
	CountryRank: number;
	Registered: string;
	LastLogin: string;
	Supporter: boolean;
	CoreDeveloper: boolean;
	Developer: boolean;
	Contributor: boolean;
	ScoreRank: number;
	PPRank: number;
	Top50Plays: MergedPlay[];
	Last50Scores: MergedPlay[];
	Source: 'merged';
}

export function mergePlayers(api: ApiPlayer, scraper: ScraperPlayer): MergedPlayer {
	const playMap = new Map(scraper.Top50Plays.map((play) => [play.Filename, play]));

	const topPlays = api.Top50Plays.map((apiPlay) =>
		mergePlays(apiPlay, playMap.get(apiPlay.Filename))
	);
	const recentPlays = api.Last50Scores.map((apiPlay) =>
		mergePlays(
			apiPlay,
			scraper.Last50Scores.find((p) => p.Filename === apiPlay.Filename)
		)
	);

	return {
		...api,
		ScoreRank: scraper.ScoreRank,
		PPRank: scraper.PPRank,
		Top50Plays: topPlays,
		Last50Scores: recentPlays,
		Source: 'merged'
	};
}

export function parsePlayerFromApi(data: ApiPlayer): ApiPlayer {
	return {
		...data,
		Top50Plays: data.Top50Plays.map(parsePlayFromApi),
		Last50Scores: data.Last50Scores?.map(parsePlayFromApi) ?? [],
		Source: 'api'
	};
}

export function parsePlayerFromScraper(data: ScraperPlayerData): ScraperPlayer {
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
		PPRank: data.ppRank,
		Source: 'scraper'
	};
}

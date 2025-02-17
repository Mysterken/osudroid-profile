import { parsePlay, type Play } from './play';

export interface Player {
	UserId: number;
	Username: string;
	GlobalRank: number;
	CountryRank: number;
	OverallScore: number;
	OverallPP: number;
	OverallPlaycount: number;
	OverallAccuracy: number;
	Registered: string;
	LastLogin: string;
	Region: string;
	Supporter: boolean;
	CoreDeveloper: boolean;
	Developer: boolean;
	Contributor: boolean;
	Top50Plays: Play[];
	Last50Scores: Play[];
}

export function parsePlayer(data: Player): Player {
	return {
		...data,
		Supporter: Boolean(data.Supporter),
		CoreDeveloper: Boolean(data.CoreDeveloper),
		Developer: Boolean(data.Developer),
		Contributor: Boolean(data.Contributor),
		Top50Plays: data.Top50Plays.map(parsePlay),
		Last50Scores: data.Last50Scores.map(parsePlay)
	};
}

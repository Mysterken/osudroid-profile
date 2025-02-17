export interface Play {
	ScoreId: number;
	Filename: string;
	Mods: string[];
	MapScore: number;
	MapCombo: number;
	MapRank: string;
	MapGeki: number;
	MapPerfect: number;
	MapKatu: number;
	MapGood: number;
	MapBad: number;
	MapMiss: number;
	MapAccuracy: number;
	MapPP: number | null;
	PlayedDate: string;
}

export function parsePlay(data: Play): Play {
	return {
		...data,
		Mods: Array.isArray(data.Mods) ? data.Mods : [],
		MapPP: data.MapPP !== null ? data.MapPP : null
	};
}

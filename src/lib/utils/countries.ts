export function getCountryName(code: string, locale = 'en'): string {
	try {
		return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || 'Unknown Country';
	} catch {
		return 'Unknown Country';
	}
}

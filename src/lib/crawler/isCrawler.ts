import crawlerUserAgents from 'crawler-user-agents';

export function isCrawler(request: Request): boolean {
	const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
	return crawlerUserAgents.some((crawler) => userAgent.includes(crawler.pattern.toLowerCase()));
}

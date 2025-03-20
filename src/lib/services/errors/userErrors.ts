export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class ApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

export class ScraperError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ScraperError';
	}
}

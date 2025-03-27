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

export class MissingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MissingError';
	}
}

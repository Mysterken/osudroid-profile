import pino from 'pino';

// Create logger instance
const logger = pino({
	level: process.env.LOG_LEVEL || 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true
		}
	}
});

export default logger;

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create logger
const logger = createLogger({
  level: 'info', // minimum log level
  format: combine(
    colorize(),      // colorize logs in console
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),               // log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // errors to file
    new transports.File({ filename: 'logs/combined.log' })               // all logs to file
  ],
  exitOnError: false
});

module.exports = logger;

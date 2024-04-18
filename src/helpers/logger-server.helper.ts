import { Handler } from 'express';
import morgan from 'morgan';
import * as path from 'path';
import * as winston from 'winston';

import { Configuration } from '@/config/configuration';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    verbose: 'blue',
    debug: 'magenta',
    silly: 'white',
};

const colorizes = winston.format.colorize({
    all: true,
});

// log format string
const someColoredFormat = winston.format.printf(({ level, timestamp, message, method }) => {
    const envMode: string = Configuration.instance.env;
    return `[${envMode}] ${timestamp} ${level}: ${method ? colorizes.colorize(level, method) : ''} ${message}`;
});

const format = winston.format.combine(
    winston.format.cli({
        colors,
        levels,
    }),
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.simple(),
    someColoredFormat,
);

export class LoggerServerHelper {
    private static logger: winston.Logger;
    private static morgan: Handler;

    static init() {
        // init morgan
        if (!LoggerServerHelper.morgan) {
            LoggerServerHelper.morgan = morgan(':method :url :status :res[content-length] - :response-time ms', {
                stream: {
                    write: (message) => LoggerServerHelper.logger.http(message.trim()),
                },
            });
        }

        // init winston logger
        if (!LoggerServerHelper.logger) {
            LoggerServerHelper.logger = winston.createLogger({
                level: 'http',
                transports: [
                    new winston.transports.Console({
                        format,
                    }),
                    new winston.transports.File({
                        maxsize: 1024 * 1024 * 10,
                        filename: path.join('logs', 'server.log'),
                        format,
                    }),
                ],
                exceptionHandlers: [new winston.transports.File({ filename: path.join('logs', 'error.log') })],
            });
        }
    }

    static log(msg: unknown) {
        LoggerServerHelper.logger.info(msg);
    }

    static error(msg: unknown) {
        LoggerServerHelper.logger?.error(msg);
    }

    static get instance() {
        return LoggerServerHelper.logger;
    }

    static get morganMiddleware() {
        return LoggerServerHelper.morgan;
    }
}

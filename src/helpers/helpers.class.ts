import axios from 'axios';
import * as winston from "winston";
import {LoggerOptions, format} from "winston";
import chalk from 'chalk';

const octopusFormat = format.printf(info => {
    info.appName = '[OCTOPUS CORE]';
    return `${chalk.blue(info.appName)} | ${info.timestamp} | ${info.level}: ${info.message}`;
});

const options: LoggerOptions = {
    level: 'debug',
    transports: [
        new winston.transports.File({ filename: 'error.log.json', level: 'error' }),
        new winston.transports.Console({
            handleExceptions: true,
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.prettyPrint(),
                format.errors({ stack: true }),
                octopusFormat,
            ),
        }),
    ],
    exitOnError: false
};

export default class HelpersClass {
    public static log() {
        return winston.createLogger(options);
    }

    public static async tryURL(url: string): Promise<object> {
        try {
            await HelpersClass.log().debug(`TRYING WITH URL | ${url}`);
            return axios.get(url)
        } catch (err) {
            throw new TypeError(`URL NOT FOUND | ${url} | ${err.message}`);
        }
    }
}

export const log = HelpersClass.log();

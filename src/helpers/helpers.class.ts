import axios from 'axios';
import winston from "winston";
import {LoggerOptions, format} from "winston";
import chalk from 'chalk';
import * as robot from 'robotjs';
import * as Jimp from 'jimp';
import {Point2} from "opencv4nodejs";
import * as cv from "opencv4nodejs";

export interface Coordinates {
    x: number,
    y: number,
}

const octopusFormat = format.printf(info => {
    info.appName = '[OCTOPUS CORE]';
    return `${chalk.blue(info.appName)} | ${info.timestamp} | ${info.level}: ${info.message}`;
});

const options: LoggerOptions = {
    level: 'debug',
    exitOnError: true,
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

export class VisionHelper {

    public static async getImageResolution(path: string): Promise<Coordinates> {
        const image = await Jimp.read(path);
        return {
            x: image.bitmap.width,
            y: image.bitmap.height,
        };
    }

    public static async center(maxLoc: Point2, path: string): Promise<Coordinates> {
        const imgRes: Coordinates = await VisionHelper.getImageResolution(path);
        const offset: Coordinates = {
            x: imgRes.x + maxLoc.x,
            y: imgRes.y + maxLoc.y,
        };
        const pt1: Point2 = await new cv.Point2(maxLoc.x, maxLoc.y);
        const pt0: Point2 = await new cv.Point2(offset.x, offset.y);

        return { x: (pt1.x + pt0.x) / 2,
            y: (pt1.y + pt0.y) / 2 };
    }

    public static async type(text: string): Promise<void> {
        await robot.typeString(text);
        // create logic for string special chars detection
    }

    public static async key(key: string, down: string) {
        await robot.keyToggle(key, down);
    }

    public static async click(): Promise<void> {
        await robot.mouseClick()
    }

    public static async move(coordinates: Coordinates, delay: number = 2): Promise<void> {
        await robot.setMouseDelay(delay); // set mouse speed delay
        await robot.moveMouseSmooth(coordinates.x, coordinates.y); // move mouse to coordinates
    }

}

export const log = HelpersClass.log();

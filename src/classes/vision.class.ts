// here comes the fun part with computer vision and science stuff
// Yay!

import {Mat, Point2} from "opencv4nodejs";
import {Bitmap} from "robotjs";
import * as robot from "robotjs";
import * as cv from "opencv4nodejs";
import {VisionHelper, Coordinates, log} from "../helpers/helpers.class";
import events from 'events';
import {TimeoutError} from "puppeteer/Errors";

export const found = new events.EventEmitter();

interface Match {
    minVal: number,
    maxVal: number,
    minLoc: Point2,
    maxLoc: Point2
}

export default class VisionClass {
    private readonly timeout: number;
    private readonly width: number = robot.getScreenSize().width;
    private readonly height: number  = robot.getScreenSize().height;
    private readonly screenOffset: Coordinates = { x: 0, y: 0 };
    private readonly threshold: number = 0.8;

    constructor(timeout: number, width?: number, height?: number, screenOffset?: Coordinates, threshold?: number) {
        this.width = width;
        this.height = height;
        this.timeout = timeout;
        this.screenOffset = screenOffset;
        this.threshold = threshold;
    }

    public async img2mat(data: Buffer): Promise<Mat> {
        return new cv.Mat(data, this.width, this.height, cv.CV_8UC4);
    }

    public async screen2mat(): Promise<Mat> {
        const cap: Bitmap = await robot.screen.capture(this.screenOffset.x, this.screenOffset.y, this.width, this.height);
        return this.img2mat(cap.image);
    }

    protected async match(element: string): Promise<Match> {
        const screenMatrix: Mat = await this.screen2mat();
        const elementMatrix: Mat = await cv.imreadAsync(element, cv.CV_8UC4);
        const screenMatrixGray: Mat = await screenMatrix.bgrToGray();
        const elementMatrixGray: Mat = await elementMatrix.bgrToGray();
        /* const elementMatrixGrayScaled = elementMatrixGray.rescale(2); in case of needed rescale of an needle image*/
        const matched: Mat = await screenMatrixGray.matchTemplate(elementMatrixGray, 5);
        return matched.minMaxLoc();
    }

    public async findAndMoveTo(element: string) {
        await log.info(`TRYING TO FIND ${element}`);
        try {
            const minMax: Match = await this.match(element);
            const { maxLoc } = minMax;
            const coordinates: Coordinates = await VisionHelper.center(maxLoc, element);
            await VisionHelper.move(coordinates);
        } catch (exception) {
            log.error(exception.toString())
        }
    }

    public async waitFor(element: string, ms: number): Promise<void> {
        const screenTimer = await setInterval( async () => {
            const minMax: Match = await this.match(element);
            const score: number = Number(minMax.maxVal.toFixed(1));
            await log.info(`EXPECTED: ${this.threshold} | GOT: ${score}`);
            if (score >= this.threshold) {
                found.emit('found', score);
            }
        }, this.timeout);
        await found.once('found', (data: number) => {
            log.info(`FOUND WITH SCORE: ${data}`);
            clearInterval(screenTimer);
        });
        await setTimeout(() => {
            log.info(`ELEMENT ${element} NOT FOUND ON THE SCREEN!`);
            clearInterval(screenTimer);
            throw new TimeoutError(`Element ${element} not found after ${this.timeout}ms`)
        }, this.timeout);
    }
}

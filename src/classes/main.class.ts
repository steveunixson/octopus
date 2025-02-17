/*
here we bootstrap our browsers or native apps (for opencv bug searching subsystem)
like Firefox or Chromium (puppeteer) or M$ Outlook (for some shitty reason)
create class instance of an environment you are using
supported browsers for now will be:
Firefox and Chrome
IE and EDGE will be opened on a dedicated vm
and that's all folks! No Safari for now, because I don't have a mac
Maybe I should get one
Just kidding I am a broke ass
*/
import puppeteer, {LaunchOptions} from 'puppeteer'
import {Browser, Page} from "puppeteer";

interface Settings {
    width: number;
    height: number;
    timeout: number;
    headless: boolean;
}

export default class Bootstrap {
    private readonly width: number;
    private readonly height: number;
    private readonly timeout: number;
    private readonly headless: boolean;
    public browser!: Browser;
    public page!: Page;

    constructor(settings: Settings) {
        this.width = settings.width;
        this.height = settings.height;
        this.timeout = settings.timeout;
        this.headless = settings.headless;
    }

    private chromeBrowser(): LaunchOptions {
        return {
            headless: this.headless,
            args: [
                `--window-size=${this.width},${this.height}`, '--no-sandbox', '--disable-setuid-sandbox',
            ],
        };
    }

    public async bootstrap(): Promise<void> {
        this.browser = await puppeteer.launch(this.chromeBrowser());
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: this.width, height: this.height });
        await this.page.setDefaultNavigationTimeout(this.timeout);
    }
}

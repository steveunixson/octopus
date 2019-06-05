// here we bootstrap our browsers or native apps (for opencv bug searching subsystem)
// like Firefox or Chromium (puppeteer) or M$ Outlook (for some shitty reason)
// create class instance of an environment you are using
// supported browsers for now will be:
// Firefox and Chrome
// IE and EDGE will be opened on a dedicated vm, because well... fuck you that's why
// and that's all folks! No Safari for now, because I don't have a mac
// Maybe I should get one
// Just kidding I am a broke ass
import * as puppeteer from 'puppeteer';
import {Browser, Page} from "puppeteer";

interface Settings {
    width: number;
    height: number;
    timeout: number;
    headless: boolean;
}

export default class Bootstrap {
    public width: number;
    public height: number;
    public timeout: number;
    public headless: boolean;
    public browser: Browser;
    public page: Page;
    constructor(settings: Settings) {
        this.width = settings.width;
        this.height = settings.height;
        this.timeout = settings.timeout;
        this.headless = settings.headless;
    }
    private chromeBrowser(): object {
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

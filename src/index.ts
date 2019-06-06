import Bootstrap from "./classes/main.class";
import HelpersClass, {log} from "./helpers/helpers.class";

export default class Octopus {
    private instance: Bootstrap;
    constructor() {
        this.instance = new Bootstrap({
            width: 1440,
            height: 900,
            timeout: 5000,
            headless: false,
        });
    }
    public async createBrowser(url: string) {
       await this.instance.bootstrap();
       await HelpersClass.tryURL(url);
       await this.instance.page.goto(url);
    }
}

new Octopus().createBrowser('https://google.com')
    .then(() => {
        log.debug('browser loaded!')
    })
    .catch((exception) => {
        log.error(exception)
    });

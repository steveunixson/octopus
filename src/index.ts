import Bootstrap from "./classes/main.class";
import HelpersClass, {log, VisionHelper} from "./helpers/helpers.class";
import VisionClass from "./classes/vision.class";

export default class Octopus {
    private instance: Bootstrap;
    private vision: VisionClass;
    constructor() {
        this.instance = new Bootstrap({
            width: 1440,
            height: 900,
            timeout: 5000,
            headless: false,
        });
        this.vision = new VisionClass(5000, 1920, 1080, {x: 0, y: 0}, 0.8);
    }
    public async createBrowser(url: string) {
       await this.instance.bootstrap();
       await HelpersClass.tryURL(url);
       await this.instance.page.goto(url);
    }

    public async testGmail() {
       await this.createBrowser('https://google.com');
       await this.vision.waitFor('/home/unixson/WebstormProjects/octopus/images/login.png', 10);
       await this.vision.findAndMoveTo('/home/unixson/WebstormProjects/octopus/images/login.png');
       await VisionHelper.click();
       await this.vision.waitFor('/home/unixson/WebstormProjects/octopus/images/loginBox.png', 10);
       await VisionHelper.type('unixson');
       await VisionHelper.key('shift', 'down');
       await VisionHelper.type('2');
       await VisionHelper.key('shift', 'up');
       await VisionHelper.type('gmail.com');
       await this.vision.findAndMoveTo('/home/unixson/WebstormProjects/octopus/images/next.png');
       await VisionHelper.click();
       await this.vision.waitFor('/home/unixson/WebstormProjects/octopus/images/loginBoxNext.png', 10);
       await VisionHelper.type('loastcoast1997');
       await this.vision.findAndMoveTo('/home/unixson/WebstormProjects/octopus/images/next.png');
       await VisionHelper.click();
       await this.vision.waitFor('/home/unixson/WebstormProjects/octopus/images/loginSuccess.png', 10);
       await this.instance.browser.close();
    }
}

const octopus = new Octopus();
    octopus.testGmail()
        .then(() => {
            log.info('TEST FINISHED')
        })
        .catch((e) => { console.log(e.toString()) });

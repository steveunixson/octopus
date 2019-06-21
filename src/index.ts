import Bootstrap from "./classes/main.class";
import HelpersClass, {log, VisionHelper} from "./helpers/helpers.class";
import VisionClass from "./classes/vision.class";

export interface OctopusInterface {
    instance: Bootstrap;
    vision: VisionClass;
    createBrowser(url: string): Promise<void>;
}

export { HelpersClass as HelpersClass };
export { VisionClass as  VisionClass };
export { VisionHelper as VisionHelper }

export default class Octopus implements OctopusInterface {
    public instance: Bootstrap;
    public vision: VisionClass;
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
}

import Bootstrap from "./classes/main.class";

export default class Octopus {
    private instance: Bootstrap;
    constructor() {
        this.instance = new Bootstrap({
            width: 1920,
            height: 1080,
            timeout: 5000,
            headless: false,
        })
    }
    public createBrowser() {
        this.instance
            .bootstrap()
            .then(() => {
                this.instance.page.goto('https://google.com')
                    .then(() => {
                        console.log('opened google.com!')
                    })
                    .catch((e: Error) => {
                        console.log('OOPS', e)
                    })
            })
            .catch((e: Error) => {
                console.log(e)
            });
    }
}

new Octopus().createBrowser();

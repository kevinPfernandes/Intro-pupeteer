const puppeteer = require('puppeteer');
const BASE_URL = 'https://www.instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;

const instagram={
    browser: null,
    page: null,

    login: async (username,password,tags=['']) =>{
        const browser = await puppeteer.launch({headless:false});
        const page =  await browser.newPage();

        await page.goto(BASE_URL, {waitUntil:'networkidle2'});
        /*Va chercher le bouton connecter */
        let loginButton = await page.$x('//a[contains(text(), "Connectez-vous")]');

        /*Clic sur le bouton connecter */
        await loginButton[0].click();

        await page.waitForNavigation({waitUntil:'networkidle2'});
        await page.waitFor(1000);

        /* Les username et password*/
        await page.type('input[name="username"]',username, {delay:50});
        await page.type('input[name="password"]',password, {delay:50});

        await page.click('button[type="submit"]');
        await page.waitFor(1000);

        for ( let tag of tags){
            await page.goto(TAG_URL(tag),{ waitUntil:'networkidle2' });
            await page.waitFor(1000);

            let posts = await page.$$('article > div:nth-child(3) img[decoding="auto"]');
            for (let i=0 ;i <3 ; i++){
                let post = posts[i];
                await post.click();
                await page.waitFor('span[id="react-root"]');
                await page.waitFor(1000);

                await post.click('span[aria-label=“J’aime”]');
                await page.waitFor(3000);

                let closeModalButton =  await page.$x('//button[contains(text(),"Fermer")]');
                await closeModalButton[0].click();
                await page.waitFor(1000);
            }
            await page.waitFor(60000);
        }
    },

};



module.exports=instagram;
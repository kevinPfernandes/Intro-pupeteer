const puppeteer = require('puppeteer');
const BASE_URL = 'https://www.instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;
/*Les accent grave servent à concaténé */

const instagram={
    browser: null,
    page: null,

    initialize: async() =>{
        instagram.browser = await puppeteer.launch({
            headless:false
        });
        instagram.page =  await instagram.browser.newPage();
    },



    login: async (username,password) =>{

        await instagram.page.goto(BASE_URL, {waitUntil:'networkidle2'});

        /*Va chercher le bouton connecter */
        let loginButton = await instagram.page.$x('//a[contains(text(), "Connectez-vous")]');

        /*Clic sur le bouton connecter */
        await loginButton[0].click();

        await instagram.page.waitFor(1000);

        /* Les username et password*/
        await instagram.page.type('input[name="username"]',username, {delay:50});
        await instagram.page.type('input[name="password"]',password, {delay:50});

        await instagram.page.click('button[type="submit"]');

        await instagram.page.waitFor(2000);

        //cliquer sur le bouton notif
        instagram.notifButton= await instagram.page.$x('//button[contains(text(),"Plus tard")]');
        await instagram.notifButton[0].click();

        await instagram.page.waitFor(2000);
        instagram.publiButton= await instagram.page.$x('//div[contains(text(),"Nouvelles publications")]');
        await instagram.publiButton[0].click();


    },

    likeTagsProcess: async(tags=['']) => {
        for ( let tag of tags){
            await instagram.page.goto(TAG_URL(tag),{ waitUntil:'networkidle2' });
            await instagram.page.waitFor(1000);

            let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');
            for (let i=0 ;i <3 ; i++){
                let post = posts[i];
                await post.click();
                await instagram.page.waitFor('#react-root');
                await instagram.page.waitFor(1000);

                let isLikable = await instagram.page.$('span[aria-label="J’aime"]');

                if(isLikable){
                    await instagram.page.click('span[aria-label="J’aime"]');
                }
                await instagram.page.waitFor(3000);

                let closeModalButton =  await instagram.page.$x('//button[contains(text(),"Fermer")]');

                await closeModalButton[0].click();

                await instagram.page.waitFor(1000);

            }
            await instagram.page.waitFor(6000);
        }

    },

};



module.exports=instagram;
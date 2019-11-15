const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const User = require('./user_model.js');

const URL = 'https://github.com/login';

const github = {
  browser: null,
  page: null,

  initialize: async () => {
    browser = await puppeteer.launch({
      headless: false
    });
    page = await browser.newPage();
    await page.goto(URL);
    await page.setViewport({
      width: 1440,
      height: 900
    });
  },

  login: async (login, psw) => {
    //! Récupère login et password et se connecte
    await page.waitForSelector('input[name="login"]');
    await page.type('input[name="login"]', `${login}`, {
      delay: 50
    });
    await page.type('input[name="password"]', `${psw}`, {
      delay: 50
    });
    await page.waitFor(500);
    await page.click('input[name="commit"]');
  },

  search: async (value) => {
    //! Search term from CLI
    await page.waitForSelector('input[aria-label="Search or jump to…"]');
    await page.type('input[aria-label="Search or jump to…"]', `${value}`, {
      delay: 50
    });
    await page.waitForSelector('a[data-target-type="Search"]');
    await page.click('a[data-target-type="Search"]');

    //! Click on User
    await page.waitForSelector(`a[href="/search?q=${value}&type=Users"]`);
    await page.click(`a[href="/search?q=${value}&type=Users"]`);
    await page.waitForNavigation();
  },

  getUsers: async (nbUsers) => {
    for (let i = 1; i <= nbUsers; i++) {
      const userNameSelector = `#user_search_results > div.user-list > div:nth-child(${i}) > div.flex-auto > div:nth-child(1) > div:nth-child(1) > a.text-gray`;
      const userEmailSelector = `#user_search_results > div.user-list > div:nth-child(${i}) > div.flex-auto > div.text-gray > div:nth-child(2) > a.muted-link`;

      //! Get UserName
      let userName = await page.evaluate((e) => {
        return document.querySelector(e).getAttribute("href").replace('/', '');
      }, userNameSelector);

      //! Get UserEmail
      let userEmail = await page.evaluate((m) => {
        let email = document.querySelector(m);
        return email ? email.innerHTML : `Y'a R`;
      }, userEmailSelector);

      //! 10 profils per page => Next page
      if (i%10 === 0) {
        await page.click('a.next_page');
        await page.waitForNavigation();
        i=0;
        nbUsers -= 10;
      }

      console.log(`UserName => ${userName} // UserMail => ${userEmail}`);
      
      //! Conect to mongo & save
      await mongoose.connect('mongodb://localhost/github',{ 
        useNewUrlParser: true ,
        useUnifiedTopology: true
      });
      
      let new_user = new User({
          username:userName,
          email:userEmail,
          date: Date.now()
      });

      new_user.save(function(err){
        if(err) console.log(err); 
      });
    }
    //! Wait & close browser
    await page.waitFor(1000);
    browser.close();
  },
}

module.exports = github;

const puppeteer = require('puppeteer')

function scrape(pageToScrape){
    return new Promise(async (resolve, reject)=>{
        try{
            if(!pageToScrape){
                pageToScrape = 1;
            }

            const browser = await puppeteer.launch({headless:false,slowMo:500})
            const page = await browser.newPage()

            await page.goto('https://news.ycombinator.com/')

            let currentPage = 1
            let urls = []

            while(currentPage <= pageToScrape){
                let newUrls = await page.evaluate(()=>{
                    let results = []
                    let items = document.querySelectorAll('a.storylink')

                    items.forEach((item)=>{
                        results.push({
                            url: item.getAttribute('href'),
                            text: item.innerText,
                        })
                    })
                    return results
                })
                urls = urls.concat(newUrls)
                if(currentPage < pageToScrape){
                    await Promise.all([
                        await page.click('a.morelink'),
                        await page.waitForSelector('a.morelink')
                    ])
                }
                currentPage++
            }
            browser.close()
            return resolve(urls)
        } catch (e){
            return reject(e)
        }
    })
}

scrape()
    .then(
        console.log
    )
    .catch(
        console.error
    )
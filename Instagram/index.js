const ig = require('./instagram');

(async ()=> {

    await ig.login('username','password',['love', 'cars']);
})()

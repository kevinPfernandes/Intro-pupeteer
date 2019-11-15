const ig = require('./instagram');

(async ()=> {
    await ig.initialize();

    await ig.login('','',);

    await ig.likeTagsProcess (['love', 'cars']);
})()
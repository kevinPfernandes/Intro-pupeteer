const ig = require('./instagram');

(async ()=> {
    await ig.initialize();

    await ig.login('wicketsolo','wicketsolo60',);

    await ig.likeTagsProcess (['love', 'cars']);
})()
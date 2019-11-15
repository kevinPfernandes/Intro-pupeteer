const github = require('./github');

const login = process.argv[2]; // identifiant github
const psw = process.argv[3]; // Mot de passe github
const value = process.argv[4]; // Search value
const nbUsers = process.argv[5]; // Nb user to scrap

//? $ node puppeteerGithub.js [login] [password] john 74

(async () => {

  await github.initialize();

  await github.login(login, psw);

  await github.search(value);

  await github.getUsers(nbUsers);

})()
const mongoose = require('mongoose');
const User = require('./user_model.js');

const db = mongoose.createConnection('localhost', 'github');
db.on('error', console.error.bind(console, 'connection error:'));

const e = db.once('open',function(){
    User.find({},{},function (err, users) {
        mongoose.connection.close();
    })
});
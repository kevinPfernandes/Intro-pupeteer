const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username:String,
    email:String,
    date:Date
});
module.exports = mongoose.model('users', userSchema); 

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
        username    : String,
        email       : String,
        password    : String,   
        googleId    : String, 
        firstName   : String,   
        lastName    : String, 
        displayName : String 

}, {timestamps: true});


const User = mongoose.model('User', UserSchema)
module.exports = User

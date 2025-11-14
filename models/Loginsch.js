


const mongoose = require('mongoose');



const LoginschSchema = new mongoose.Schema({
    email:String,
    password:String
})

const Loginsch = mongoose.model("login", LoginschSchema)

module.exports =  Loginsch


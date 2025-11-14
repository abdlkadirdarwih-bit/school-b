

   const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: String,
    fullname: String,
    phonenumber: String,
    titlename: String,
    additionalnotes: String,
   

})

const ContactModel = mongoose.model("contactschool", ContactSchema)

module.exports = ContactModel
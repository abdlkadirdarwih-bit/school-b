
   const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: String,
    fullname: String,
    phonenumber: String,
    titlename: String,
    additionalnotes: String,
   

})

const OrderModel = mongoose.model("orderproduct", OrderSchema)

module.exports = OrderModel
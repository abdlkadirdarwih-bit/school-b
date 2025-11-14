


const mongoose = require('mongoose');



const OrderscheckSchema = new mongoose.Schema({
    fullnameord: String,
    phonenumberord: String,
    titlenameord: String,
    additionalnotesord: String,
     paymentMethod: String,       
  subtotal: Number,        
  deliveryCost: Number,        
  total: Number  ,
   deliveryArea: String,    


})

const OrderscheckModel = mongoose.model("orderscheck", OrderscheckSchema)

module.exports =  OrderscheckModel



// const OrderSchema = new mongoose.Schema(
//   { fullname: String },
//   { collection: "order" } // 👈 بهذا الشكل الاسم لن يتحول
// );

// const Order = mongoose.model("Order", OrderSchema);



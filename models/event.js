
   const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
//  imageId:String,
 mainImage: String, 
// imageId: [String], // an array of image URLs
 images: [String],
    date:String,
        place:String,
        title :String,
            text:String,


})

const EventModel = mongoose.model("events", EventSchema)

module.exports = EventModel
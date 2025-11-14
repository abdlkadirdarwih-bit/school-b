
    // "start": "nodemon index.js"


// div multi line in react
// design ui/ux add event web 
// https://www.w3schools.com/css/css_image_transparency.asp
// https://dashboard.render.com/
// This is how you "create" data in MongoDB through a React app.
//React sends a POST request.
// Express receives it and uses Mongoose to create in MongoDB.

// import dotenv from "dotenv";
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const bodyParser = require("body-parser");
 const bcrypt = require("bcrypt");
 
const Loginsch = require('./models/Loginsch.js')

const multer = require('multer');
const fs = require('fs');
const path = require('path');
// import path from "path";

// crud
// const UserModel = require('./models/Users.js')
// order product
const OrderModel = require('./models/order.js')
// orderscheck
const OrderscheckModel = require('./models/orders.js')
// event activities 
const EventModel = require('./models/event.js')
// const GroupModel = require('./models/Group');
// const GroupModel = require('./models/Group');
const ContactModel = require('./models/contact.js')
const User = require('./models/User.js')
const dotenv = require("dotenv");

// const PORT = process.env.PORT;
const PORT = process.env.PORT || 3001;
const app = express()

dotenv.config();
app.use(express.json())
// app.use(cors())
app.use(cors({
  // origin: "http://localhost:5174",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

// app.options("*", cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded files
// const __dirname = path.resolve();

// mongoose.connect('mongodb://127.0.0.1:27017/schoolDB')
// const URL = "mongodb://127.0.0.1:27017/school"
 const URL = process.env.MONGODB_URL;
//  {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }
mongoose.connect(URL)
.then(() => console.log("✅ Connected to MongoDB successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));



// Serve frontend build
// app.use(express.static(path.join(__dirname, "client", "dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });


// 📝 Login Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const valid = await user.validatePassword(password);
  if (!valid) return res.status(400).json({ message: "Invalid email or password" });

  res.json({ message: "Login successful", email: user.email });
});

// 🔐 Change Password Route
app.post("/api/auth/change-password", async (req, res) => {
  const { email, oldPassword,newPassword } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).json({ message: "User not found" });

  // 🛡️ Verify old password
  const valid = await user.validatePassword(oldPassword);
  if (!valid) return res.status(400).json({ message: "Old password is incorrect" });

  await user.setPassword(newPassword);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// 🧪 Register Route
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const exist = await User.findOne({ email: email.toLowerCase() });
  if (exist) return res.status(400).json({ message: "Email already exists" });

  const user = new User({ email: email.toLowerCase() });
  await user.setPassword(password);
  await user.save();

  res.json({ message: "User created" });
});








// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // unique filenames
  }
});

const upload = multer({ storage });

// ✅ Create Event with mainImage + multiple images
// app.post("/createEvent", upload.fields([
//   { name: "mainImage", maxCount: 1 },
//   { name: "images", maxCount: 10 }
// ]), async (req, res) => {
//   try {
//     const { date, place, title, text } = req.body;

//     const mainImagePath = req.files.mainImage ? req.files.mainImage[0].path : '';
//     const imagesPaths = req.files.images ? req.files.images.map(f => f.path) : [];

//     const newEvent = new EventModel({
//       mainImage: mainImagePath,
//       images: imagesPaths,
//       date,
//       place,
//       title,
//       text
//     });

//     const savedEvent = await newEvent.save();
//     res.status(201).json(savedEvent);
//     console.log("📌 Event saved:", savedEvent);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


app.post("/createEvent", upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 10 }
]), async (req, res) => {
  try {
    const { date, place, title, text } = req.body;

    // Construct URLs for main image and additional images
    const mainImagePath = req.files.mainImage 
      ? '/uploads/' + req.files.mainImage[0].filename 
      : '';

    const imagesPaths = req.files.images 
      ? req.files.images.map(f => '/uploads/' + f.filename) 
      : [];

    // Create and save new event
    const newEvent = new EventModel({
      mainImage: mainImagePath,
      images: imagesPaths,
      date,
      place,
      title,
      text
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
    console.log("📌 Event saved:", savedEvent);

  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
});





// crud
// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')
// const UserModel = require('./models/Users')

// const app = express()
// app.use(cors())
// app.use(express.json())
// mongoose.connect("mongodb://127.0.0.1:27017/crud")
// crud


// mongodb://localhost:27017
// mongoose:تسهل التعامل مع MongoDB في تطبيقات Node.js

// mongoose.connect('mongodb://127.0.0.1:27017/employee', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   family: 4, // Ensure IPv4
// }).then(() => {
//   console.log('Connected to MongoDB successfully!');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// .then(() => {
//   console.log("Connected to MongoDB!");
// }).catch((err) => {
//   console.log("MongoDB connection error:", err);
// });;

// create route (post)



app.post("/loginsch", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if this is the allowed account
    if (email === "ali@gmail.com") {

      // Look for the user in MongoDB
      let user = await Loginsch.findOne({ email });

      if (!user) {
        // User doesn't exist → create it
        const newUser = new Loginsch({ email, password: "34432" }); // save default password
        await newUser.save();
        console.log("✅ New user ali@gmail.com created in MongoDB");
        return res.json("registered and logged in");
      }

      // User exists → check password
      if (password === "34432") {
        console.log("✅ Login successful for ali@gmail.com");
        return res.json("success");
      } else {
        return res.json("the password is incorrect");
      }

    } else {
      // Any other email → not allowed
      return res.json("invalid credentials");
    }

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



app.delete("/delete-abd", async (req, res) => {
  try {
    await Loginsch.deleteMany({ email: "abd@gmail.com" });
    res.send("✅ abd@gmail.com removed from MongoDB");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   //read
//   Loginsch.findOne({ email: email })
//     .then(user => {
//       if (user) {
//         if (user.password === password) {
//           res.json('success')
//         } else {
//           res.json('the password is incorrect ')
//         }
//       } else {
//         res.json('no record existed ')
//       }
//     })
// })





// mongoose.connection.once('open', () => {
//     console.log('MongoDB connected');
//   });



// create 



app.post('/register', (req, res) => {
  EmployeeModel.create(req.body)
    .then(signuptalabe => res.json(signuptalabe))
    .catch(err => res.json(err));
})


// order 
app.post('/orderproduct', (req, res) => {
    console.log("📩 Incoming order:", req.body);  // للتأكد من وصول البيانات

  OrderModel.create(req.body)
    .then(orderproduct=>{
            console.log("✅ Saved order:", orderproduct);

       res.json(orderproduct)})
    .catch(err => res.json(err));
})



// orders 
app.post('/ordersproducts', (req, res) => {
    console.log("📩 Incoming order:", req.body);  // للتأكد من وصول البيانات

  OrderscheckModel.create(req.body)
    .then(orderscheck=>{
            // console.log("✅ Saved order:", orderscheck);

       res.json(orderscheck)})
    .catch(err => res.json(err));
})


// Add a route to fetch all saved contacts in react:

app.get('/contactschool', async (req, res) => {
  try {
    const contacts = await ContactModel.find();
        // console.log("📩 Sending contacts:", contacts); 

    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

app.post('/contactschool', (req, res) => {
    // console.log("📩 Incoming order:", req.body); 
     // للتأكد من وصول البيانات

  ContactModel.create(req.body)
    .then(contactsch=>{
            console.log("✅ Saved order:", contactsch);

       res.json(contactsch)})
    .catch(err => res.json(err));
})

app.get("/" , (req,res) => {
    EventModel.find({})
    .then(event => res.json(event))
    .catch(err => res.json(err))
})



// app.get("/" , (req,res) => {
//     const id = req.params.id;
//     UserModel.findById({_id:id})
//     .then(users => res.json(users))
//     .catch(err => res.json(err))
// })  
// true
app.get("/getUser/:id" , (req,res) => {
    const id = req.params.id;
    EventModel.findById({_id:id})
    .then(event => res.json(event))
    .catch(err => res.json(err))
})

// index.js
// app.get("/getevents/:id", (req, res) => {
//   const { id } = req.params;
//   EventModel.findById(id)
//     .then(event => {
//       if (!event) return res.status(404).json({ message: "Event not found" });
//       res.json(event);
//     })
//     .catch(err => res.status(500).json(err));
// });


app.put("/updateEvent/:id" , (req,res) => {
    const id = req.params.id;
    EventModel.findByIdAndUpdate({_id:id}, {
                mainImage	: req.body.mainImage	,  

      images	: req.body.images	,  
      date	: req.body.date,  
     place: req.body.place,  
           title : req.body. title , 
                       text: req.body.  text,  
 
            

    })
    .then(event => res.json(event))
            // .then(user => res.json(user))

        // .then(groups => res.json(groups))

    .catch(err => res.json(err))
})  


// app.delete("/deleteUser/:id" , (req,res) => {
//     const id = req.params.id;
//     UserModel.findByIdAndDelete({_id:id})
  
//     .then(users => res.json(users))
//     .catch(err => res.json(err))
// })  


app.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await EventModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// app.post("/createUser" , (req,res) => {
//     UserModel.create(req.body)
//     .then(users => res.json(users))
//         // .then(user => res.json(user))

//         // .then(groups => res.json(groups))

//     .catch(err => res.json(err))
// })

// app.post("/createUser", async (req, res) => {
//   try {
//     const newProduct = new Product(req.body);
//     const savedProduct = await newProduct.save();
//     res.json(savedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


// ✅ Create user
app.post("/createEvent", async (req, res) => {
  try {
    const newUser = new EventModel(req.body);   // create new user instance
    const savedUser = await newUser.save();    // save to DB
    
  res.status(201).json(savedUser);           // send back saved user
            // console.log("📌 Event saved:", savedUser); // 👈 log here

} catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// app.put("/updateCount/:id", async (req, res) => {
//   try {
//     const updated = await UserModel.findByIdAndUpdate(
//       req.params.id,
//       { count: req.body.count },
//             // { $inc: { count: req.body.inc } }, // inc = +1 أو -1 من الـ frontend

//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Error updating count:", err); // يظهر في الـ terminal
//     res.status(500).json({ error: err.message });
//   }
// });


// Update one image by index
// app.put("/updateEventImage/:id", async (req, res) => {
//   try {
//     const { index, url } = req.body;
//     const event = await UserModel.findById(req.params.id);

//     if (!event) return res.status(404).json({ message: "Event not found" });

//     event.images[index] = url; // replace image at index
//     await event.save();

//     res.json({ message: "Image updated", event });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Use DELETE only when you want to delete the entire event.
// Use PUT (or PATCH) when you want to delete one or more images from an existing event but keep the event itself.
// Example: remove the 2nd image from images array → event still exists.
// Works for multiple images, you just update the array.
app.put("/deleteEventImage/:id", async (req, res) => {
  try {
    const { index } = req.body;
    const event = await EventModel.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.images.splice(index, 1); // remove the image at the given index
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json(err);
  }
});





app.get("/", (req, res) => {
  res.send("Backend is working success ✅");
});


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)

})




















// -------------------------------------------------------------------






























// -------------------------------------------------------------------

// const mongoose = require('mongoose');



// const EmployeeSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String
// })

// const EmployeeModel = mongoose.model("employees", EmployeeSchema)

// module.exports = EmployeeModel




// To create (insert) data in MongoDB from a React.js project, you typically follow this structure:


// ---

// Step-by-Step Guide

// 1. Backend Setup (Node.js + Express + MongoDB)

// You'll need a backend server to handle requests from your React app.

// // Example: server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

// // Define Schema and Model
// const UserSchema = new mongoose.Schema({ name: String, age: Number });
// const User = mongoose.model('User', UserSchema);

// // Create Route (POST)
// app.post('/api/users', async (req, res) => {
//   try {
//     const newUser = await User.create(req.body);
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));


// ---

  // 2. Frontend Setup(React.js)
    
  //   In your React component, use fetch or axios to send data to the backend.

  // Example: Create Form in React

// import { useState } from 'react';
// import axios from 'axios';

// function CreateUser() {
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/users', { name, age });
//       console.log('User created:', res.data);
//     } catch (err) {
//       console.error('Error creating user:', err.response?.data);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
//       <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" type="number" />
//       <button type="submit">Create User</button>
//     </form>
//   );
// }

// export default CreateUser;

// -------------------------------------------------------------------





// import { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";

// function Signup() {
//   const [name, setName] = useState()
//   const [email, setEmail] = useState()
//   const [password, setPassword] = useState()
//   const navigate = useNavigate()

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     axios.post('http://localhost:3001/register', { name, email, password })
//       .then(result => console.log(result))
//     navigate('/login')
//       .catch(err => console.log(err))
//   }
//   return (

//     <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
//       <div className="bg-white p-3 rounded w-25">
//         <h2>Register</h2>
//         <form onSubmit={handleSubmit}></form>


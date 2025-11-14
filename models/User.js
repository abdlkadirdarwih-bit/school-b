



const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// 📄 User Model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: { type: String, required: true },
});

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

userSchema.methods.validatePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

const User = mongoose.model("User", userSchema);
module.exports = User
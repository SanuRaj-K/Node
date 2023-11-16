const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt= require('bcrypt')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  cart: Array,
  wishlist: Array,
  orders: Array,
});
userSchema.pre('save', async function(next){
  try {
     
    const salt= await bcrypt.genSalt(10)
    const hashedPass= await bcrypt.hash(this.password,salt)
    this.password= hashedPass
    next()
  } catch (err) {
    next(err)
  }
})
userSchema.methods.isValidPass= async function (password){
 try {
    return await bcrypt.compare(password, this.password)
 } catch (err) {
  console.log(err);
 }
}
const User = mongoose.model("userSchema", userSchema);

module.exports = User;

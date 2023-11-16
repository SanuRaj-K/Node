const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
   title:String,
   description:String,
   price:Number,
   image:String,
   category:String,
 });

 const Products = mongoose.model('ProductSchema', productSchema);

module.exports = Products;

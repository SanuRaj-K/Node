const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dgoermgtp",
  api_key: "793724638942354",
  api_secret: "9wtYsULCkM5qkKZK3QHy0RxJJHc",
});
module.exports = cloudinary;

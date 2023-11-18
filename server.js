const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const useRoute = require("./Routers/usersRoute");
const adminRoute = require("./Routers/adminRoute");
app.use(cookies());
app.use("/users", useRoute);
app.use("/admin", adminRoute);
app.use(errorHandler);

mongoose.connect("mongodb://localhost:27017/project");
app.listen(5000, () => {
  console.log("running");
});

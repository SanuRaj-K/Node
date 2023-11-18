const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const customError = require("./helpers/coustomError");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const useRoute = require("./Routers/usersRoute");
const adminRoute = require("./Routers/adminRoute");
const up = require("./Routers/upload");
app.use(cookies());
app.use("/uplod", up);
app.use("/users", useRoute);
app.use("/admin", adminRoute);

app.get("/errr", (req, res, next) => {
  try {
    subran();
  } catch (e) {
    const err = new customError(e.message, 400);
    next(err);
  }
});

app.use(errorHandler);

mongoose.connect("mongodb://localhost:27017/project");
app.listen(5000, () => {
  console.log("running");
});

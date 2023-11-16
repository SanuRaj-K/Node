const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.cookies.adminAuth;
  if (!token) {
    res.status(400).send("unauthorised");
  } else {
    next();
  }
};

module.exports = { adminAuth };

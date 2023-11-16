const jwt = require("jsonwebtoken");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: userId,
      };
      const secret = "some super secret";
      const options = {
        expiresIn: "1h",
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  },
};

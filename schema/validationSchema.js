const joi = require("joi");

const authSchema = joi.object({
  username: joi.string().lowercase().required(),
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(3).required(),
});

module.exports = {
  authSchema,
};

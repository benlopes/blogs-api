const Joi = require('joi');

const BAD_REQ = 400;

const userSchema = Joi.object({
  displayName: Joi.string().min(8).required(),
  email: Joi.string().email().min(4).required(),
  password: Joi.string().length(6).required(),
});

const valUser = (req, res, next) => {
  const { displayName, email, password } = req.body;

  const validateUser = userSchema.validate({ displayName, email, password });
  
  if (validateUser.error) {
    return res.status(BAD_REQ)
      .json({ message: validateUser.error.details[0].message });
  }
  
  next();
};

module.exports = { valUser };
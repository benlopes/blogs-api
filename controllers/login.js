const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Users } = require('../models');

const secret = 'supersecret';

const jwtConfig = {
  expiresIn: '30m',
  algorithm: 'HS256',
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const login = async (req, res) => {
  const validateLogin = loginSchema.validate(req.body);

  if (validateLogin.error) {
    return res.status(400).json({ message: validateLogin.error.details[0].message });
  }

  const { email } = req.body;
  const exists = await Users.findOne({ where: { email } });

  if (!exists) return res.status(400).json({ message: 'Invalid fields' });

  const payload = { email, id: exists.dataValues.id };
  const token = jwt.sign(payload, secret, jwtConfig);

  return res.status(200).json({ token });
};

module.exports = login;
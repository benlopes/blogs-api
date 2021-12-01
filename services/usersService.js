const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const secret = 'supersecret';

const jwtConfig = {
  expiresIn: '30m',
  algorithm: 'HS256',
};

const addUser = async ({ displayName, email, password, image = null }) => {
  const exists = await Users.findOne({ where: { displayName } });

  if (exists) return { status: 409, message: 'User already registered' };

  await Users.create({ displayName, email, password, image });

  const token = jwt.sign({ displayName }, secret, jwtConfig);
  return { status: 201, message: token };
};

module.exports = { addUser };
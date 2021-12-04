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

const listUsers = async () => {
  const users = await Users
    .findAll({ attributes: ['id', 'displayName', 'email', 'password', 'image'] });

  return { status: 200, message: users };
};

const getUserById = async (id) => {
  const user = await Users.findByPk(id);

  if (!user) return { status: 404, message: 'User does not exist' };

  return { status: 200, message: user };
};

module.exports = { addUser, listUsers, getUserById };
const { Categories } = require('../models');

const addCategory = async (name) => {

  if (!name) return { status: 400, message: '"name" is required' };

  const { dataValues } = await Categories.create({ name });

  return { status: 201, message: dataValues };
};

// const listUsers = async () => {
//   const users = await Users
//     .findAll({ attributes: ['id', 'displayName', 'email', 'password', 'image'] });

//   return { status: 200, message: users };
// };

// const getUserById = async (id) => {
//   const user = await Users.findByPk(id);

//   console.log('user:', user);
//   if (!user) return { status: 404, message: 'User does not exist' };
//   console.log('user2:', user);
//   return { status: 200, message: user };
// };

module.exports = { addCategory };
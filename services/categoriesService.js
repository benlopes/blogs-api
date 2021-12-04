const { Categories } = require('../models');

const addCategory = async (name) => {

  if (!name) return { status: 400, message: '"name" is required' };

  const { dataValues } = await Categories.create({ name });

  return { status: 201, message: dataValues };
};

const listCategories = async () => {
  const categories = await Categories
    .findAll({ attributes: ['id', 'name'] });

  return { status: 200, message: categories };
};

// const getUserById = async (id) => {
//   const user = await Users.findByPk(id);

//   console.log('user:', user);
//   if (!user) return { status: 404, message: 'User does not exist' };
//   console.log('user2:', user);
//   return { status: 200, message: user };
// };

module.exports = { addCategory, listCategories };
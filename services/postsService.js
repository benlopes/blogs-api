const Joi = require('joi');
const { BlogPosts, Categories } = require('../models');

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.array().required(),
  id: Joi.required(),
});

const categoryExists = async (ids) => {
  const result = await Categories.findOne({ where: { id: ids[0] } });

  return result;
};

const addPost = async (body) => {
  const validatePost = postSchema.validate(body);

  if (validatePost.error) {
    return { status: 400, message: validatePost.error.details[0].message };
  }
  const returnedF = await categoryExists(body.categoryIds);

  if (!returnedF) return { status: 400, message: '"categoryIds" not found' };

  const post = { 
    title: body.title,
    content: body.content,
    userId: body.id,
    published: Date.now(),
    updated: Date.now() };

  const { dataValues } = await BlogPosts.create(post);

  return { status: 201, message: dataValues };
};

// const listCategories = async () => {
//   const categories = await Categories
//     .findAll({ attributes: ['id', 'name'] });

//   return { status: 200, message: categories };
// };

// const getUserById = async (id) => {
//   const user = await Users.findByPk(id);

//   console.log('user:', user);
//   if (!user) return { status: 404, message: 'User does not exist' };
//   console.log('user2:', user);
//   return { status: 200, message: user };
// };

module.exports = { addPost };
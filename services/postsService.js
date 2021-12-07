const Joi = require('joi');
const { BlogPosts, Categories, Users, PostsCategories } = require('../models');

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

const createPostsCategory = async (categoryId, postId) => {
  const result = await PostsCategories.create({ categoryId, postId });
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

  await body.categoryIds.forEach(async (categoryId) => {
    await createPostsCategory(categoryId, body.id);
  });

  return { status: 201, message: dataValues };
};

const getPosts = async () => {
  const posts = await BlogPosts.findAll({ include:
    [
      { model: Users, as: 'user', attributes: { exclude: ['password'] } }, 
      { model: Categories, as: 'categories', through: { attributes: [] } },
    ] });

  return { status: 200, message: posts };
};

const getPostById = async (id) => {
  // const post = await BlogPosts.findByPk(id);
  const post = await BlogPosts.findAll({ where: { id },
    include: [
      { model: Users, as: 'user', attributes: { exclude: ['password'] } }, 
      { model: Categories, as: 'categories', through: { attributes: [] } },
    ], 
  });

  if (!post || post.length === 0) return { status: 404, message: 'Post does not exist' };

  console.log('post:', post[0].dataValues);
  return { status: 200, message: post[0].dataValues };
};

module.exports = { addPost, getPosts, getPostById };
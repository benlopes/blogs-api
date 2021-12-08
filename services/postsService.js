const Joi = require('joi');
const { Op } = require('sequelize');
const { BlogPosts, Categories, Users, PostsCategories } = require('../models');

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.array().required(),
  id: Joi.required(),
});

const editPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
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

const editPost = async ({ postId, userId, title, content, categoryIds }) => {
  if (categoryIds) return { status: 400, message: 'Categories cannot be edited' };

  const validateEditPost = editPostSchema
    .validate({ title, content });

  if (validateEditPost.error) {
    return { status: 400, message: validateEditPost.error.details[0] };
  }

  const { dataValues } = await BlogPosts.findByPk(postId);

  if (userId !== dataValues.userId) return { status: 401, message: 'Unauthorized user' };
  
  await BlogPosts.update(
    { title, content },
    { where: { id: postId } },
  );
  
  const edited = await BlogPosts.findAll({ where: { id: postId },
    include: [{ model: Categories, as: 'categories', through: { attributes: [] } }], 
  });

  return { status: 200, message: edited[0].dataValues };
};

const deletePost = async ({ postId, userId }) => {
  const post = await BlogPosts.findByPk(postId);

  if (!post) return { status: 404, message: 'Post does not exist' };
  
  const { dataValues } = post;

  if (userId !== dataValues.userId) return { status: 401, message: 'Unauthorized user' };
  
  await BlogPosts.destroy({ where: { id: postId } });

  return { status: 204, message: null };
};

const queryPost = async (query) => {
  if (!query) return getPosts();

  const post = await BlogPosts.findAll({
    where: {
      [Op.or]: [{ title: query }, { content: query }],
    },
    include: [
      { model: Users, as: 'user', attributes: { exclude: ['password'] } }, 
      { model: Categories, as: 'categories', through: { attributes: [] } },
    ],
  });

  return { status: 200, message: post };
};

module.exports = { addPost, getPosts, getPostById, editPost, deletePost, queryPost };
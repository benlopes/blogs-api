const router = require('express').Router();
const { posts } = require('../services');
const { payload } = require('../auth/validateToken');

router.post('/', payload, async (req, res) => {
  const { status, message } = await posts.addPost({ ...req.body, id: req.userId });
 
  if (status === 400) return res.status(status).json({ message });

  return res.status(status).json(message);
});

router.get('/search', payload, async (req, res) => {
  const { q } = req.query;

  const { status, message } = await posts.queryPost(q);

  if (status === 404) return res.status(status).json({ message });

  return res.status(status).json(message);
});

router.get('/', payload, async (req, res) => {
  const { status, message } = await posts.getPosts();

  return res.status(status).json(message);
});

router.get('/:id', payload, async (req, res) => {
  const { id } = req.params;

  const { status, message } = await posts.getPostById(id);

  if (status === 404) return res.status(status).json({ message });

  return res.status(status).json(message);
});

router.put('/:id', payload, async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryIds = null } = req.body;

  const { status, message } = await posts
    .editPost({ postId: id, userId: req.userId, title, content, categoryIds });

  if (status === 404) return res.status(status).json({ message });
  if (status === 401) return res.status(status).json({ message });
  if (categoryIds) return res.status(status).json({ message });

  return res.status(status).json(message);
});

router.delete('/:id', payload, async (req, res) => {
  const { status, message } = await posts
    .deletePost({ postId: req.params.id, userId: req.userId });

  if (status === 401) return res.status(status).json({ message });

  return res.status(status).json(message);
});

module.exports = router;

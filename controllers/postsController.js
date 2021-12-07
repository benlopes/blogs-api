const router = require('express').Router();
const { posts } = require('../services');
const { payload } = require('../auth/validateToken');

router.post('/', payload, async (req, res) => {
  const { status, message } = await posts.addPost({ ...req.body, id: req.userId });
 
  if (status === 400) return res.status(status).json({ message });

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

module.exports = router;

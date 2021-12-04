const router = require('express').Router();
const { categories } = require('../services');
const { payload } = require('../auth/validateToken');

router.post('/', payload, async (req, res) => {
  const { status, message } = await categories.addCategory(req.body.name);
 
  if (status === 400) return res.status(status).json({ message });

  return res.status(status).json(message);
});

router.get('/', payload, async (req, res) => {
  const { status, message } = await categories.listCategories();

  return res.status(status).json(message);
});

// router.get('/:id', payload, async (req, res) => {
//   const { id } = req.params;

//   const { status, message } = await users.getUserById(id);

//   if (status === 404) return res.status(status).json({ message });

//   return res.status(status).json(message);
// });

module.exports = router;

const router = require('express').Router();
const { users } = require('../services');
const val = require('../validations/usersValidation');
const { payload } = require('../auth/validateToken');

router.post('/', val.valUser, async (req, res) => {
  const { status, message } = await users.addUser(req.body);

  if (status === 409) return res.status(status).json({ message });

  return res.status(status).json({ token: message });
});

router.get('/', payload, async (req, res) => {
  const { status, message } = await users.listUsers();

  return res.status(status).json(message);
});

router.get('/:id', payload, async (req, res) => {
  const { id } = req.params;

  const { status, message } = await users.getUserById(id);

  if (status === 404) return res.status(status).json({ message });

  return res.status(status).json(message);
});

router.delete('/me', payload, async (req, res) => {
  const { status, message } = await users
    .deleteUser({ userId: req.userId });

  return res.status(status).json(message);
});

module.exports = router;

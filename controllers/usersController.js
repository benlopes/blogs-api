const router = require('express').Router();
const { users } = require('../services');
const val = require('../validations/usersValidation');

router.post('/', val.valUser, async (req, res) => {
  const { status, message } = await users.addUser(req.body);

  if (status === 409) return res.status(status).json({ message });

  return res.status(status).json({ token: message });
});

module.exports = router;

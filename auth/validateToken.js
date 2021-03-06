const jwt = require('jsonwebtoken');

const secret = 'supersecret';

const jwtConfig = {
  expiresIn: '30m',
  algorithm: 'HS256',
};

const payload = async (req, res, next) => {
  req.user = '0';
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Token not found' });
  try {
    const data = jwt.verify(token, secret, (_err, decoded) => decoded);

    const tokenVerified = jwt.verify(token, secret, jwtConfig);

    req.user = tokenVerified;
    req.userId = data.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

module.exports = { payload };

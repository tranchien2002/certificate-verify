const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, 'supersecret123', (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: 'Failed to authentication token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
};

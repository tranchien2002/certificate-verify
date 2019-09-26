const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  res.json({
    hello: 'auth'
  });
});

module.exports = router;

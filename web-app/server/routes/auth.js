const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
var checkJWT = require('../middlewares/check-jwt');

router.get('/login', async (req, res) => {
  res.json({
    hello: 'auth'
  });
});

// Register
router.post('/register', async (req, res, next) => {
  let user = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  });

  User.findOne({ username: user.username }, async (err, existing) => {
    if (existing) {
      res.json({
        success: false,
        msg: 'Account is exits'
      });
    } else {
      await user.save();

      var token = jwt.sign(
        {
          user: user
        },
        'supersecret123'
      );

      res.json({
        success: true,
        msg: 'token',
        token: token
      });
    }
  });
});

// Login
router.post('/login', (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.json({
        success: false,
        message: 'Username not exits'
      });
    } else if (user) {
      var validPassword = bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Wrong password'
        });
      } else {
        var token = jwt.sign(
          {
            user: user
          },
          'supersecret123'
        );

        res.json({
          success: true,
          user: user.name,
          message: 'enjoy',
          token: token
        });
      }
    }
  });
});

// Get Profile
router
  .route('/profile')
  .get(checkJWT, (req, res, next) => {
    // get profile if send Authorization : token in headers of request
    User.findOne({ username: req.decoded.user.username }, (err, user) => {
      res.json({
        success: true,
        user: user,
        msg: 'successful'
      });
    });
  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({ username: req.decoded.user.username }, async (err, user) => {
      if (err) return next(err);

      // test change name of user
      if (req.body.name) user.name = req.body.name;
      // Do something with user

      user.save();
      res.json({
        name: user.name,
        success: true,
        message: 'success'
      });
    });
  });

module.exports = router;

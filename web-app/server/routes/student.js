const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network.js');
const { validationResult, sanitizeParam, check } = require('express-validator');
const User = require('../models/User');

router.get('/all', async (req, res) => {
  // if (req.decoded.user.role === USER_ROLES.STUDENT) {
  //   res.status(403).json({
  //     success: false,
  //     msg: 'Failed',
  //     status: '403'
  //   });
  // }

  const networkObj = await network.connectToNetwork(req.decoded.user);

  const response = await network.query(networkObj, 'GetAllStudents');

  if (response.success == true) {
    res.json({
      success: true,
      msg: response.msg.toString()
    });
  } else {
    res.json({
      success: false,
      msg: response.msg.toString()
    });
  }
});

router.get(
  '/:username',
  [
    sanitizeParam('username')
      .trim()
      .escape()
  ],
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array(), status: '422' });
    }

    var username = req.params.username;

    User.findOne({ username: username, role: USER_ROLES.STUDENT }, async (err, student) => {
      if (err) {
        res.json({
          success: false,
          msg: err
        });
      } else {
        const networkObj = await network.connectToNetwork(req.decoded.user);
        const response = await network.query(networkObj, 'QueryStudent', username);
        if (response.success == true) {
          res.json({
            success: true,
            msg: response.msg.toString()
          });
        } else {
          res.json({
            success: false,
            msg: response.msg.toString()
          });
        }
      }
    });
  }
);

module.exports = router;

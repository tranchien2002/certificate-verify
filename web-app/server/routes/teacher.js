const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

router.get('/create', async (req, res) => {
  if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
    res.json({
      success: false,
      msg: 'Failed'
    });
  } else {
    res.json({
      hello: 'new teacher'
    });
  }
});

router.post(
  '/create',
  check('username')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  check('fullname')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  check('address')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  check('phonenumber')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
      res.json({
        success: false,
        msg: 'Failed'
      });
    } else {
      let teacher = new User({
        username: req.body.username,
        password: '123456',
        role: USER_ROLES.TEACHER
      });

      let identityOnBlockChain = {
        username: req.body.username,
        fullname: req.body.fullname,
        phonenumber: req.body.phonenumber,
        address: req.body.address
      };

      User.findOne({ username: teacher.username }, async (err, existing) => {
        if (err) throw next(err);
        if (existing) {
          res.status(409).json({
            success: false,
            msg: 'Account is exist'
          });
        } else {
          await teacher.save();
          await network.registerTeacherOnBlockchain(identityOnBlockChain);
          res.json({
            success: true,
            msg: 'Create Success'
          });
        }
      });
    }
  }
);

router.post(
  '/score',
  check('subjectid')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  check('studentusername')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  check('score')
    .not()
    .isEmpty()
    .isFloat(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.decoded.user.role !== USER_ROLES.TEACHER) {
      res.status(403).json({
        success: false,
        msg: 'Permission Denied'
      });
    } else {
      const user = req.decoded.user;

      const studentusername = req.body.studentusername;
      const subjectid = req.body.subjectid;
      const score = req.body.score;

      let networkObj = await network.connectToNetwork(user);

      if (networkObj.error) {
        res.status(500).json({
          success: false,
          msg: 'Failed'
        });
      }

      let response = await network.createScore(networkObj, subjectid, studentusername, score);

      if (!response) {
        res.status(500).json({
          success: false,
          msg: 'Error create score'
        });
      } else {
        res.json({
          success: true,
          msg: 'Create score success'
        });
      }
    }
  }
);

router.get('/all', async (req, res, next) => {
  if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
    res.json({
      success: false,
      msg: 'Failed'
    });
  } else {
    User.find({ role: USER_ROLES.TEACHER }, async (err, teachers) => {
      if (err) {
        res.json({
          success: false,
          msg: err
        });
      } else {
        res.json({
          success: true,
          teachers: teachers
        });
      }
    });
  }
});

router.get('/:username', async (req, res, next) => {
  if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
    res.json({
      success: false,
      msg: 'Failed'
    });
  } else {
    var username = req.params.username;
    console.log(username);

    User.findOne({ username: username, role: USER_ROLES.TEACHER }, async (err, teacher) => {
      if (err) {
        res.json({
          success: false,
          msg: err
        });
      } else {
        var username = req.params.username;
        console.log(username);

        User.findOne({ username: username }, async (err, teacher) => {
          if (err) {
            res.json({
              success: false,
              msg: err
            });
          } else {
            res.json({
              success: true,
              teacher: teacher
            });
          }
        });
      }
    });
  }
});

module.exports = router;

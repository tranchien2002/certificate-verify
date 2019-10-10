const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const { check, validationResult, sanitizeParam } = require('express-validator');
const User = require('../models/User');
const checkJWT = require('../middlewares/check-jwt');

router.get('/create', async (req, res) => {
  if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
    res.status(403).json({
      success: false,
      msg: 'Permission Denied',
      status: '403'
    });
  } else {
    res.json({
      success: true
    });
  }
});

router.post(
  '/create',
  checkJWT,
  [
    (check('subjectname')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('subjectid')
      .not()
      .isEmpty()
      .trim()
      .escape())
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array(), status: '422' });
    }

    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
      res.status(403).json({
        success: false,
        msg: 'Permission Denied',
        status: '422'
      });
    } else {
      let subject = {
        subjectID: req.body.subjectid,
        subjectName: req.body.subjectname
      };
      const networkObj = await network.connectToNetwork(req.decoded.user);
      const response = await network.createSubject(networkObj, subject);
      if (response.success == true) {
        res.json({
          success: true,
          msg: response.msg
          // token: token
        });
      } else {
        res.json({
          success: false,
          msg: response.msg
          // token: token
        });
      }
    }
  }
);

router.post(
  '/:subjectid/addteacher',
  checkJWT,
  [
    check('teacherusername')
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array(), status: '422' });
    }

    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
      res.status(403).json({
        success: false,
        msg: 'Permission Denied',
        status: '422'
      });
    } else {
      User.findOne(
        { username: req.body.teacherusername, role: USER_ROLES.TEACHER },
        async (err, teacher) => {
          if (err) throw err;
          if (teacher) {
            const networkObj = await network.connectToNetwork(req.decoded.user);
            const response = await network.registerTeacherForSubject(
              networkObj,
              req.params.subjectid,
              req.body.teacherusername
            );
            if (response.success == true) {
              res.json({
                success: true,
                msg: response.msg
                // token: token
              });
            } else {
              res.json({
                success: false,
                msg: response.msg
                // token: token
              });
            }
          }
        }
      );
    }
  }
);

router.get('/all', checkJWT, async (req, res, next) => {
  const networkObj = await network.connectToNetwork(req.decoded.user);

  const response = await network.query(networkObj, 'GetAllSubjects');

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

router.get('/:subjectid', checkJWT, async (req, res, next) => {
  const subjectID = req.params.subjectid;
  const networkObj = await network.connectToNetwork(req.decoded.user);
  const response = await network.query(networkObj, 'QuerySubject', subjectID);
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

module.exports = router;

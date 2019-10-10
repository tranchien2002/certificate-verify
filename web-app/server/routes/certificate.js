const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const { check, validationResult, sanitizeParam } = require('express-validator');
const checkJWT = require('../middlewares/check-jwt');
const Certificate = require('../models/Certificate');

router.get('/create', checkJWT, async (req, res) => {
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
  checkJWT,
  // [check('subjectid').isLength({ min: 6 }), check('username').isLength({ min: 6 })],
  async (req, res) => {
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
      const networkObj = await network.connectToNetwork(req.decoded.user);

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      var issueDate = date + ' ' + time;

      let certificate = {
        certificateID: Math.random()
          .toString(36)
          .substr(2, 9),
        subjectID: req.body.subjectid,
        studentUsername: req.body.username,
        issueDate: issueDate
      };

      const response = await network.createCertificate(networkObj, certificate);

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
  }
);

router.get('/:certificateid', checkJWT, async (req, res) => {
  var ceritificateid = req.params.certificateid;
  console.log(ceritificateid);
  await Certificate.findOne({ certificateID: ceritificateid }, async (err, ceritificate) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.json({
        success: true,
        msg: ceritificate
      });
    }
  });
});

router.get('/:certificateid/verify', checkJWT, async (req, res) => {
  var ceritificateid = req.params.certificateid;
  Certificate.findOne({ certificateID: ceritificateid }, async (err, ceritificate) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      const networkObj = await network.connectToNetwork(req.decoded.user);
      const response = await network.verifyCertificate(networkObj, ceritificate);

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
});

module.exports = router;

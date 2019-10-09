const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const Certificate = require('../models/Certificate');
const mongoose = require('mongoose');

const { check, validationResult } = require('express-validator');
const checkJWT = require('../middlewares/check-jwt');

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
  checkJWT,
  [check('subjectid').isLength({ min: 6 }), check('username').isLength({ min: 6 })],
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
      let networkObj = network.connectToNetwork(req.decoded.user);

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      var issueDate = date + ' ' + time;

      let certificate = new Certificate({
        subjectID: req.body.subjectID,
        username: req.body.username,
        issueDate: issueDate
      });

      await certificate.save(async (err, certificate) => {
        certificate.certificateID = certificate._id;
        await network.createCertificate(networkObj, certificate);
        res.json({
          success: true,
          msg: 'Create Success'
        });
      });
    }
  }
);

router.get('/:certificateid', async (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.certificateid)) {
    Certificate.find(req.params.certificateid, (err, cert) => {
      if (!cert) {
        res.json({
          success: false,
          msg: "certificate doesn't exit"
        });
      } else {
        res.json({
          success: true,
          cert: cert
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: "certificate doesn't exit"
    });
  }
});

router.get('/certififcate/:certificateid/verify', async (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.certificateid)) {
    Certificate.find(req.params.certificateid, async (err, cert) => {
      if (!cert) {
        res.json({
          success: false,
          msg: "certificate doesn't exit"
        });
      } else {
        ceritificateOnBlockChain = await network.query(
          'QueryCertificate',
          req.params.certificateid
        );
        var cerJSON = JSON.parse(ceritificateOnBlockChain);
        if (
          cerJSON.StudentUserName != ceritificate.username ||
          cerJSON.SubjectID != ceritificate.subjectID
        ) {
          res.json({
            success: false,
            msg: 'False'
          });
        } else {
          res.json({
            success: true,
            ceritificate: ceritificate
          });
        }
      }
    });
  } else {
    res.json({
      success: false,
      msg: "certificate doesn't exit"
    });
  }
});

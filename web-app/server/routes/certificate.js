const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const STATUS_CERT = require('../configs/constant').STATUS_CERT;
const network = require('../fabric/network');
const { check, validationResult, sanitizeParam } = require('express-validator');
const checkJWT = require('../middlewares/check-jwt');
const Certificate = require('../models/Certificate');
const uuidv4 = require('uuid/v4');
require('dotenv').config();

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
  [
    (check('subjectId')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('studentUsername')
      .not()
      .isEmpty()
      .trim()
      .escape())
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
      return res.json({
        success: false,
        msg: 'Failed'
      });
    }
    const networkObj = await network.connectToNetwork(req.decoded.user);
    var issueDate = new Date().toString();

    let certificate = {
      certificateID: uuidv4(),
      subjectID: req.body.subjectId,
      studentUsername: req.body.studentUsername,
      issueDate: issueDate
    };

    const response = await network.createCertificate(networkObj, certificate);

    if (!response.success) {
      return res.json({
        success: false,
        msg: response.msg
      });
    }
    const queryCertificate = await network.query(
      networkObj,
      'GetCertificatesBySubject',
      req.body.subjectId
    );
    const queryScore = await network.query(networkObj, 'GetScoresBySubject', req.body.subjectId);
    const queryStudent = await network.query(
      networkObj,
      'GetStudentsBySubject',
      req.body.subjectId
    );

    if (!queryCertificate.success || !queryScore.success || !queryStudent.success) {
      return res.json({
        success: false,
        msg: response.msg.toString()
      });
    }

    let listScore = JSON.parse(queryScore.msg);
    let listCertificates = JSON.parse(queryCertificate.msg);
    let listStudents = JSON.parse(queryStudent.msg);

    listStudents.forEach((student) => {
      student['statusCertificate'] = STATUS_CERT.NO_SCORE;
      student['ScoreValue'] = null;
      if (listScore) {
        listScore.forEach((score) => {
          if (score.StudentUsername === student.Username) {
            student['ScoreValue'] = score.ScoreValue;
            if (score.Certificated) {
              student['statusCertificate'] = STATUS_CERT.CERTIFICATED;
              listCertificates.forEach((cert) => {
                if (student.Username === cert.StudentUsername) {
                  student['certificateId'] = cert.CertificateID;
                }
              });
            } else {
              student['statusCertificate'] = STATUS_CERT.NO_CERT;
            }
          }
        });
      }
    });
    return res.json({
      success: true,
      students: listStudents
    });
  }
);

router.get('/:certId', async (req, res) => {
  var certId = req.params.certId;
  await Certificate.findOne({ certificateID: certId }, async (err, ceritificate) => {
    if (err) {
      return res.json({
        success: false,
        msg: err
      });
    }
    return res.json({
      success: true,
      msg: ceritificate
    });
  });
});

router.get('/all', async (req, res) => {
  if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
    return res.json({
      success: false,
      msg: 'Failed'
    });
  }
  await User.findOne({ username: req.decoded.user.username }, async (err, user) => {
    if (err) {
      return res.json({
        success: false,
        msg: err
      });
    }
    await Certificate.find(async (err, ceritificates) => {
      if (err) {
        return res.json({
          success: false,
          msg: err
        });
      }
      return res.json({
        success: true,
        ceritificates: ceritificates
      });
    });
  });
});

router.get('/:certId/verify', async (req, res) => {
  let username;
  if (req.decoded.user) {
    username = req.decoded.user.username;
  } else {
    username = process.env.DEFAULT_USER;
  }
  User.findOne({ username: username }, async (err, user) => {
    if (err) {
      return res.json({
        success: false,
        msg: err
      });
    }
    var certId = req.params.certId;
    Certificate.findOne({ certificateID: certId }, async (err, ceritificate) => {
      if (err) {
        return res.json({
          success: false,
          msg: err
        });
      }
      const networkObj = await network.connectToNetwork(user);
      const response = await network.verifyCertificate(networkObj, ceritificate);

      if (response.success) {
        return res.json({
          success: true,
          msg: response.msg.toString()
        });
      }
      return res.json({
        success: false,
        msg: response.msg.toString()
      });
    });
  });
});

module.exports = router;

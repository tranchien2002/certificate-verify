const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const STATUS_REGISTERED = require('../configs/constant').STATUS_REGISTERED;
const network = require('../fabric/network.js');
const User = require('../models/User');
const { validationResult, sanitizeParam, check } = require('express-validator');
const checkJWT = require('../middlewares/check-jwt');

router.get('/', async (req, res) => {
  const user = req.decoded.user;

  if (user.role === USER_ROLES.STUDENT) {
    const networkObj = await network.connectToNetwork(user);

    if (!networkObj) {
      return res.json({
        success: false,
        msg: 'Failed connect to blockchain',
        status: 500
      });
    }

    const response = await network.query(networkObj, 'QueryStudent', user.username);
    if (!response.success) {
      return res.json({
        success: false,
        msg: response.msg
      });
    }
    return res.json({
      success: true,
      username: response.msg.Username,
      fullname: response.msg.Fullname
    });
  } else if (user.role === USER_ROLES.TEACHER) {
    const networkObj = await network.connectToNetwork(user);

    if (!networkObj) {
      return res.json({
        success: false,
        msg: 'Failed connect to blockchain',
        status: 500
      });
    }

    const response = await network.query(networkObj, 'QueryTeacher', user.username);

    if (!response.success) {
      return res.json({
        success: false,
        msg: response.msg.toString()
      });
    }
    return res.json({
      success: true,
      username: response.msg.Username,
      fullname: response.msg.Fullname
    });
  } else if (user.role === USER_ROLES.ADMIN_ACADEMY || user.role === USER_ROLES.ADMIN_STUDENT) {
    return res.json({ success: true, username: user.username, role: user.role });
  }
});

router.get('/mysubjects', async (req, res) => {
  const user = req.decoded.user;

  if (user.role === USER_ROLES.STUDENT) {
    const networkObj = await network.connectToNetwork(user);

    if (!networkObj) {
      return res.json({
        success: false,
        msg: 'Failed connect to blockchain',
        status: 500
      });
    }

    const response = await network.query(networkObj, 'GetMySubjects');

    if (!response.success) {
      return res.json({
        success: false,
        msg: response.msg.toString()
      });
    }
    return res.json({
      success: true,
      subjects: JSON.parse(response.msg)
    });
  }
  if (user.role === USER_ROLES.TEACHER) {
    const networkObj = await network.connectToNetwork(user);

    if (!networkObj) {
      return res.json({
        success: false,
        msg: 'Failed connect to blockchain',
        status: 500
      });
    }

    const response = await network.query(networkObj, 'GetSubjectsByTeacher', user.username);

    if (!response.success) {
      return res.json({
        success: false,
        msg: response.msg.toString()
      });
    }
    return res.json({
      success: true,
      subjects: JSON.parse(response.msg)
    });
  }
  return res.json({
    success: true,
    msg: 'You do not have subject'
  });
});

router.get('/subjects', async (req, res) => {
  const user = req.decoded.user;

  // if (user.role === USER_ROLES.STUDENT) {
  const networkObj = await network.connectToNetwork(user);

  if (!networkObj) {
    return res.json({
      success: false,
      msg: 'Failed connect to blockchain',
      status: 500
    });
  }

  const response = await network.query(networkObj, 'GetAllSubjects');
  const certs = await network.query(networkObj, 'GetMyCerts');

  if (!response.success || !certs.success) {
    return res.json({
      success: false,
      msg: response.msg.toString()
    });
  }
  let subjectStatus = JSON.parse(response.msg);
  let listCertificates = JSON.parse(certs.msg);
  subjectStatus.forEach((subject) => {
    subject['statusConfirm'] = STATUS_REGISTERED.UNREGISTERED;
    if (subject.Students) {
      if (subject.Students.includes(user.username)) {
        subject['statusConfirm'] = STATUS_REGISTERED.REGISTERED;
      }
      if (listCertificates && listCertificates.length !== 0) {
        listCertificates.forEach((cert) => {
          if (
            cert.SubjectID === subject.SubjectID &&
            cert.StudentUsername === req.decoded.user.username
          ) {
            subject['statusConfirm'] = STATUS_REGISTERED.CERTIFICATED;
          }
        });
      }
    }
  });
  return res.json({
    success: true,
    subjects: subjectStatus
  });
});

router.get(
  '/subjects/:subjectId/scores',
  [
    sanitizeParam('subjectId')
      .trim()
      .escape()
  ],
  async (req, res) => {
    const user = req.decoded.user;
    if (user.role === USER_ROLES.TEACHER) {
      const networkObj = await network.connectToNetwork(user);
      var subjectID = req.params.subjectId;

      if (!networkObj) {
        return res.json({
          success: false,
          msg: 'Failed connect to blockchain',
          status: 500
        });
      }

      const response = await network.query(networkObj, 'GetScoresBySubjectOfTeacher', subjectID);

      if (!response.success) {
        return res.json({
          success: false,
          scores: JSON.parse(response.msg)
        });
      }
      return res.json({
        success: true,
        subjects: response.msg.toString()
      });
    }
    return res.json({
      success: true,
      msg: 'You do not have subject'
    });
  }
);

router.get('/mycertificates', async (req, res) => {
  const user = req.decoded.user;

  if (user.role === USER_ROLES.STUDENT) {
    const networkObj = await network.connectToNetwork(user);

    if (!networkObj) {
      return res.json({
        success: false,
        msg: 'Failed connect to blockchain',
        status: 500
      });
    }

    const response = await network.query(networkObj, 'GetMyCerts');

    if (!response.success) {
      return res.json({
        success: false,
        certificates: JSON.parse(response.msg)
      });
    }
    return res.json({
      success: true,
      msg: response.msg.toString()
    });
  }
  return res.json({
    success: true,
    msg: 'You are not student'
  });
});

router.get('/scores', async (req, res) => {
  const user = req.decoded.user;

  if (user.role === USER_ROLES.STUDENT) {
    const networkObj = await network.connectToNetwork(user);

    if (!networkObj) {
      return res.json({
        success: false,
        msg: 'Failed connect to blockchain',
        status: 500
      });
    }

    const response = await network.query(networkObj, 'GetMyScores');

    if (!response.success) {
      return res.json({
        success: false,
        scores: JSON.parse(response.msg)
      });
    }
    return res.json({
      success: true,
      msg: response.msg
    });
  }
  return res.json({
    success: true,
    msg: 'You are not student'
  });
});

router.post(
  '/registersubject',
  [
    check('subjectId')
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

    if (req.decoded.user.role !== USER_ROLES.STUDENT) {
      return res.json({
        success: false,
        msg: 'Permission Denied',
        status: 403
      });
    }
    const networkObj = await network.connectToNetwork(req.decoded.user);
    const response = await network.registerStudentForSubject(
      networkObj,
      req.body.subjectId,
      req.decoded.user.username
    );
    if (!response.success) {
      return res.json({
        success: false,
        msg: response.msg
      });
    }

    return res.json({
      success: true,
      msg: response.msg
    });
  }
);

router.get('/createscore', async (req, res) => {
  if (req.decoded.user.role !== USER_ROLES.TEACHER) {
    return res.json({
      success: false,
      msg: 'Permission Denied',
      status: 403
    });
  }
  return res.json({
    success: true
  });
});

router.post(
  '/createscore',
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
      .escape(),
    check('scoreValue')
      .not()
      .isEmpty()
      .trim()
      .escape())
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, errors: errors.array(), status: 422 });
    }
    if (req.decoded.user.role !== USER_ROLES.TEACHER) {
      return res.json({
        success: false,
        msg: 'Permission Denied',
        status: 403
      });
    }
    User.findOne(
      { username: req.body.studentUsername, role: USER_ROLES.STUDENT },
      async (err, student) => {
        if (err) throw next(err);
        if (student) {
          let score = {
            subjectID: req.body.subjectId,
            studentUsername: req.body.studentUsername,
            scoreValue: req.body.scoreValue
          };
          const networkObj = await network.connectToNetwork(req.decoded.user);
          const response = await network.createScore(networkObj, score);

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
        }
      }
    );
  }
);

router.get('/:subjectId/students', checkJWT, async (req, res, next) => {
  await User.findOne({ username: req.decoded.user }, async (err, user) => {
    if (err) throw err;
    else {
      const subjectId = req.params.subjectId;
      const networkObj = await network.connectToNetwork(req.decoded.user);
      const queryStudents = await network.query(networkObj, 'GetStudentsBySubject', subjectId);
      const queryScore = await network.query(networkObj, 'GetScoresBySubject', subjectId);

      if (!queryStudents.success || !queryScore.success) {
        return res.json({
          success: false,
          msg: 'Error when call chaincode'
        });
      }

      let listScore = JSON.parse(queryScore.msg);
      let listStudents = JSON.parse(queryStudents.msg);

      listStudents.forEach((student) => {
        if (listScore) {
          listScore.forEach((score) => {
            if (score.StudentUsername === student.Username) {
              student['ScoreValue'] = score.ScoreValue;
            }
          });
        } else {
          student['ScoreValue'] = null;
        }
      });
      return res.json({
        success: true,
        students: listStudents
      });
    }
  });
});

module.exports = router;

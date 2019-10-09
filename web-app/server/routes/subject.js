const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const { check, validationResult, sanitizeParam } = require('express-validator');

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
  [
    check('subjectname')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('subjectid')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('teacherusername')
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  async (req, res) => {
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
      const user = req.decoded.user;
      const subjectId = req.body.subjectid;
      const subjectName = req.body.subjectname;
      const teacherUsername = req.body.teacherusername;

      let networkObj = await network.connectToNetwork(user);

      if (networkObj.error) {
        res.status(500).json({
          success: false,
          msg: 'Failed to connect blockchain',
          status: '500'
        });
      }

      let response = await network.createSubject(
        networkObj,
        subjectId,
        subjectName,
        teacherUsername
      );

      if (!response) {
        res.status(500).json({
          success: false,
          msg: 'Failed'
        });
      } else {
        res.json({
          success: true,
          msg: 'Create subject success'
        });
      }
    }
  }
);

router.get('/all', async (req, res) => {
  const user = req.decoded.user;

  let networkObj = await network.connectToNetwork(user);

  if (networkObj.error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to connect blockchain',
      status: '500'
    });
  }

  let response = await network.query(networkObj, 'GetAllSubjects');

  if (!response) {
    res.status(404).send({ error: 'Not Found', status: '404' });
  } else {
    res.json(response);
  }
});

router.get(
  '/:id',
  [
    sanitizeParam('id')
      .trim()
      .escape()
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array(), status: '422' });
    }

    const user = req.decoded.user;

    let networkObj = await network.connectToNetwork(user);

    if (networkObj.error) {
      res.status(500).json({
        success: false,
        msg: 'Failed to connect blockchain',
        status: '500'
      });
    }

    let response = await network.query(networkObj, 'QuerySubject', req.params.id);
    if (!response) {
      res.status(404).send({ error: 'Not Found', status: '404' });
    } else {
      res.json(response);
    }
  }
);

module.exports = router;

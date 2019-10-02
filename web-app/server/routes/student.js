const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network.js');
const { validationResult, sanitizeParam, check } = require('express-validator');

router.get('/all', async (req, res) => {
  if (req.decoded.user.role === USER_ROLES.STUDENT) {
    res.status(403).json({
      success: false,
      msg: 'Failed',
      status: '403'
    });
  }

  const user = req.decoded.user;

  let networkObj = await network.connectToNetwork(user);

  if (networkObj.error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to connect blockchain',
      status: '500'
    });
  } else {
    let response = await network.query(networkObj, 'GetAllStudents');

    if (!response) {
      res.status(404).json({
        success: false,
        msg: 'Not Found',
        status: '404'
      });
    } else {
      res.json(response);
    }
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

    let response = await network.query(networkObj, 'QueryStudent', req.params.id);

    if (!response) {
      res.status(404).json({
        success: false,
        msg: 'Not Found',
        status: '404'
      });
    } else {
      res.json(response);
    }
  }
);

module.exports = router;

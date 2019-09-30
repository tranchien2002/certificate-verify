const router = require('express').Router();

const controller = require('../controllers/teacher.controller');

router.get('/create', controller.create);

router.post('/create', controller.postCreate);

module.exports = router;
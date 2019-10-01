const router = require('express').Router();
const controller = require('../controllers/teacher');

router.get('/create', async (req, res) => {
    res.json({
        hello: 'new teacher'
    });
});

router.post('/create',
    [
        check('username').isLength({min: 6})
    ],
    controller.postCreate
);

router.get('/', controller.getListTeacher);

router.get('/:username', controller.get);

module.exports = router;
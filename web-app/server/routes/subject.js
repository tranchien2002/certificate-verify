const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');

const { check, validationResult } = require('express-validator');
const checkJWT = require('../middlewares/check-jwt');

router.get('/create', checkJWT, async (req, res) => {
    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
        res.json({
            success: false,
            msg: 'Failed'
        });
    } else {
        res.json({
            hello: 'new subject'
        });
    }
});

router.post('/create',
    checkJWT,
    [
        check('subjectName').isLength({min: 6}),
    ],
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
            //await network.createSubject(req.body.subjectName);
            next();
        }
    }
);

router.get('/all', async (req, res, next) => {

    //allSubjects = await network.getAllSubjects();

    res.json({
        success: true
        //subjects: allSubjects
    });
});

router.get('/:subjectid',  async (req, res, next) => {
    var subjectid = req.params.subjectid;

    //subject = await network.getSubject(subjectid);

    res.json({
        success: true
        // subject: subject
    });
})

module.exports = router;

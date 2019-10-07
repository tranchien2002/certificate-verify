const router = require('express').Router();
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

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

router.post('/create',
    [
        check('username').isLength({min: 6}),
        check('name').isLength({min: 5}),
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
            let teacher = new User({
                name: req.body.name,
                username: req.body.username,
                password: '123456',
                role: USER_ROLES.TEACHER
            });

            User.findOne({username: teacher.username}, async (err, existing) => {
                if (err) throw next(err);
                if (existing) {
                    res.json({
                        success: false,
                        msg: 'Account is exist'
                    });
                } else {
                    await teacher.save();
                    await network.registerUser(teacher.username, 'academy');
                    res.json({
                        success: true,
                        msg: 'Create Success'
                    });
                }
            })

        }
    }
);

router.get('/all', async (req, res, next) => {
    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
        res.json({
            success: false,
            msg: 'Failed'
        });
    } else {
        User.find({role: USER_ROLES.TEACHER}, async (err, teachers) => {
            if (err) {
                res.json({
                    success: false,
                    msg: err
                })
            } else {
                res.json({
                    success: true,
                    teachers: teachers
                })
            }
        });
    }
});

router.get('/:username', async (req, res, next) => {
    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
        res.json({
            success: false,
            msg: 'Failed'
        });
    } else {
        var username = req.params.username;
        console.log(username);

        User.findOne({username: username, role: USER_ROLES.TEACHER}, async (err, teacher) => {
            if (err) {
                res.json({
                    success: false,
                    msg: err
                });
            } else {
                res.json({
                    success: true,
                    teacher: teacher
                });
            }
        });
    }
});

module.exports = router;

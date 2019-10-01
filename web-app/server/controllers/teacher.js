const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const networkAcademy = require('../fabric/networkAcademy');

module.exports.postCreate = async function(req, res) {
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
            if (err) {
                res.json({
                    success: false;
                    msg: err
                })
            }
            if (existing) {
                res.json({
                    success: false,
                    msg: 'Account is exixts'
                });
            } else {
                await teacher.save();
                await networkAcademy.registerTeacher(teacher.username);
            }
        });
    }
}

module.exports.getListTeacher = async function(req, res) {
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
}

module.exports.get = async function(req, res) {
    if (req.decoded.user.role !== USER_ROLES.ADMIN_ACADEMY) {
        res.json({
            success: false,
            msg: 'Failed'
        });
    } else {
        var username = req.params.username;

        User.findOne({username: username}, async (err, teacher) => {
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
}
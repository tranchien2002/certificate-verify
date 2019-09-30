const User = require('../models/User');
const USER_ROLE = require('../configs/constant').USER_ROLE;
const networkAcademy = require('../fabric/networkAcademy');

module.exports.create = function(req, res){
    res.render('teacher/crerate')
};

module.exports.postCreate = async function(req, res, next){
    try {
        if (req.user.role != USER_ROLE.ADMIN_ACADEMY) {
            res.render('/auth/login', {
                errros: [
                    "You are not admin acdemy."
                ],
            });
            return;
        }
        var username = req.body.username;
        await networkAcademy.registerTeacher(username);
        next();
    } catch (error) {
        return error;
    }
};
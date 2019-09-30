var User = require('../models/User');
require('dotenv').config();
var jwt = require('jsonwebtoken')

module.exports.requireAuth = function(req, res, next) {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        var jwtToken = req.headers.authorization.split(' ')[4];
        jwt.verify(jwtToken, process.env.JWT_SECRET, function(err, payload){
            if (err) {
                res.status(401).json({message: 'Unauthorized user!'});
            } else {
                User.findOne({
                    'username': payload.user.username
                }, function(err, user){
                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).json({message: 'Unauthorized user'});
                    }
                })
            }
        });
    } else {
        res.status(401).json({message: 'Unauthorized user!'});
    }
};
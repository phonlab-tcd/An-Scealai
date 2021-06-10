const logger = require('../logger.js');

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function(req, res) {

    if(!req.body.username || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "Username and password required"
        });
        return;
    }

    logger.info(req.body);

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.role = req.body.role;

    user.save(function(err) {
        //console.log(user._id);
        if(err) { 
            console.log("Mongo error\nError code: ", err.code, "\n");
            if(err.code === 11000) {
                sendJSONresponse(res, 400, {
                    "message": "Username taken, please choose another"
                })
            } 
            return;
        };
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token" : token
        });
    });
};

module.exports.login = function(req, res) {
    
    if(!req.body.username || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "Username and password required"
        });
        return;
    }
    
    passport.authenticate('local', function(err, user, info) {
        var token;

        if(err) {
            console.log(err)
            res.status(404).json(err);
            return;
        }

        if(user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            res.status(400).json(info);
        }
    })(req, res);
};

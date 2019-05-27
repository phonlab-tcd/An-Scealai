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
            "message": "All fields required"
        });
        return;
    }

    console.log(req.body);

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function(err) {
        console.log(user._id);
        if(err) { console.log("BIG ERROR", err); return; };
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
            "message": "All fields are required"
        });
        return;
    }
    
    passport.authenticate('local', function(err, user, info) {
        var token;

        if(err) {
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
            res.status(401).json(info);
        }
    })(req, res);
};

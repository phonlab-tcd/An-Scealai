const passport = require('passport');
module.exports.jwtmw      = passport.authenticate('jwt',{session: false});
module.exports.passwordmw = passport.authenticate('local');

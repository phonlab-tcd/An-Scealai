const {expressjwt: jwt} = require('express-jwt');
export = jwt({
  secret: process.env.PUBLIC_KEY,
  algorithms: ['RS256'],
  requestProperty: 'user',
  getToken: req=>{console.log(req.cookies);return req.cookies?.token},
});
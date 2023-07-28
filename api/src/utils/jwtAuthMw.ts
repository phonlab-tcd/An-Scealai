const {expressjwt: jwt} = require('express-jwt');

const mw = jwt({
  secret: process.env.PUBLIC_KEY,
  algorithms: ['RS256'],
  requestProperty: 'user',
});

export default function(req,res,next){
	console.log("checking jwt:", req.protocol, req.host, req.originalUrl);
	mw(req,res,next);
}

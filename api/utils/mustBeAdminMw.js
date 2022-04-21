module.exports = (req,res,next) => {
  if(req.user.role === "ADMIN") {
    return next();
  }
  res.status(401).send();
}

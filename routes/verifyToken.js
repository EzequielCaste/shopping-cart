const jwt = require('jsonwebtoken');

//Middleware
module.exports = function (req, res, next){
  const token = req.session.authToken;

  req.session.oldUrl = req.url;

  //if(!token) return res.status(401).send('Access Denied');
  if(!token) return res.status(401).render('user/signin');
  
  try{
    //verify gets the user ID
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified;    

    next();
  }catch(err){
    res.status(400).render('error', {error: 'Invalid Token'});
  }
}
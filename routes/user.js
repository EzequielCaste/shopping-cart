const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const verify = require('./verifyToken')
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require('./validation');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//USER PROFILE
router.get('/profile', verify, async (req, res, next) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  
  res.render('user/profile', {user: user})
});


//USER LOGIN > render signin
router.get('/signin', (req, res) => {
  res.render('user/signin');
});

//USER LOGIN > render profile
router.post('/signin', async (req, res) => {
  //Validate data before 
  const { error } = loginValidation(req.body);
  if(error) return res.status(400).render("error", {error: error.details[0].message});
  //Check if the email exists
  const user = await User.findOne({username: req.body.username})

  if(!user) return res.status(400).render("error", {error: 'Username or password is wrong'});
  //PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).render("error", {error: 'Invalid Username or password is wrong'});
  //CREATE AND ASSIGN A TOKEN
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  req.session.authToken = token;

  console.log(req.session.user);
  
  res.redirect(req.session.oldUrl || "/user/profile")
});

//USER SIGNUP > render signup
router.get('/signup', (req, res) => {
  res.render("user/signup")
});

//NEW USER SIGNUP > create new user
router.post('/signup', async (req, res) => {
  //Validate data before 
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).render("error", {error: error.details[0].message});
  //Check if user is already in DB
  const nameExist = await User.findOne({username: req.body.username})
  if(nameExist) return res.status(400).render("error", {error: 'Name already registered'});

  //HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //Create new user
  const user = new User({
    username: req.body.username,    
    password: hashPassword
  });
  try {
    const savedUser = await user.save()
    //res.send({user: savedUser.id})
    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    //res.set('auth-token', token).render("home", { user: user});
    req.session.authToken = token;
    
    res.redirect("/user/profile")
  }catch(err){
    res.status(400).send(err).redirect('/')
  }
});
//USER LOGOUT
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/')
})
module.exports = router;


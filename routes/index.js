const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const bcrypt = require('bcrypt');
const verify = require('./verifyToken')
const {registerValidation, loginValidation} = require('./validation');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* GET home page. */
router.get('/', async (req, res, next) => {  
  const products = await Product.find({})    
  res.render('./shop/index', { title: 'Shopping Cart', products: products });
});

// ABOUT PAGE
router.get("/about", (req, res) => {
  res.render("about")
})

// ADD ITEM TO CART
router.get('/add-to-cart/:id', (req, res, next) => { 
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if(err) return res.redirect("/");
     
    cart.add(product, product.id);
    req.session.cart = cart;    
    
    res.redirect("/");
  });
});

// ADD ONE MORE TO CART
router.get('/add-one/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if(err) return res.redirect("/");
     
    cart.add(product, product.id);
    req.session.cart = cart;    
    
    res.redirect("/shopping-cart");
  });
})


// REMOVE ITEM FROM CART
router.get('/remove-item/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if(err) return res.redirect("/");
     
    cart.remove(product, product.id);
    
    if(cart.totalQty === undefined) {
      req.session.cart = null;
      return res.render('shop/shopping-cart', {products: null})
    } else {
      req.session.cart = cart;  
    }        
    
    res.redirect("/shopping-cart");
  });
});



router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {    
    return res.render('shop/shopping-cart', {products: null})
  }

  let cart = new Cart(req.session.cart);
  let prod = (cart.generateArray());

  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


// CHECKOUT ROUTE
router.get('/checkout', verify, (req, res, next) => {
  req.session.cart = null;    
  res.render('shop/checkout', {products: null})
})

// CLEAR CART ROUTE
router.get('/clear-cart', (req, res, next) => {
  req.session.cart = null;    
  res.redirect("/")
})


module.exports = router;

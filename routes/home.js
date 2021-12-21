const express = require('express');
const router = express.Router();
const passport = require('passport');
const housesCtrl = require('../controllers/houses');


// GET "/" - Home Route
router.get('/', housesCtrl.home);

// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/' }));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;

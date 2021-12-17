const express = require('express');
const router = express.Router();
const housesCtrl = require('../controllers/houses');
const isLoggedIn = require('../config/auth');

// All paths in this router have "/houses" prefixed to them

// GET "/houses" - Index Route
router.get('/', housesCtrl.index);

// POST "/houses" - Create Route
router.post('/', isLoggedIn, housesCtrl.create);

// GET "/houses/new" - New Route
router.get('/new', isLoggedIn, housesCtrl.new);

// GET "/houses/:id" - Show Route
router.get('/:id', housesCtrl.show);

module.exports = router;

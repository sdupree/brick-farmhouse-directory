const express = require('express');
const router = express.Router();
const picturesCtrl = require('../controllers/pictures');
const isLoggedIn = require('../config/auth');

// All paths in this router have nothing prefixed to them

// POST "/houses/:id/pictures" - Create Route
router.post('/houses/:id/pictures', isLoggedIn, picturesCtrl.create);

// DELETE "/pictures/:id" - Delete Route
router.delete('/pictures/:id', isLoggedIn, picturesCtrl.delete);

module.exports = router;

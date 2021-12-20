const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');
const isLoggedIn = require('../config/auth');

// All paths in this router have nothing prefixed to them

// POST "/houses/:id/comments" - Create Route
router.post('/houses/:id/comments', isLoggedIn, commentsCtrl.create);

// DELETE "/comments/:id" - Delete Route
router.delete('/comments/:id', isLoggedIn, commentsCtrl.delete);

module.exports = router;

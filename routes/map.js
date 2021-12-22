const express = require('express');
const router = express.Router();
const passport = require('passport');
const mapCtrl = require('../controllers/map');

// All paths in this router have "/map" prefixed to them

// GET "/map" - Map Rotue.
router.get('/', mapCtrl.map);

module.exports = router;

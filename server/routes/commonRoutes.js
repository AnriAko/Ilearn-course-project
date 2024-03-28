const itemController = require('../controllers/itemController');
const express = require('express');
const router = express.Router();

router.get('/allItems', itemController.getAllItems);

module.exports = router;
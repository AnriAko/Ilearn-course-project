const itemController = require('../controllers/itemController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.get('/allItems', itemController.getAllItems);
router.get('/users/:userID', authController.getOneUser);


module.exports = router;
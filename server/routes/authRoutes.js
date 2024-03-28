const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const { registrationValidationRules, loginValidationRules } = AuthController;

router.post('/signup', registrationValidationRules(), (req, res, next) => {
	AuthController.registration(req, res, next);
});

router.post('/login', loginValidationRules(), (req, res, next) => {
	AuthController.login(req, res, next);
});

module.exports = router;
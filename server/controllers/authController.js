const { body, validationResult } = require('express-validator');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models/models');
const { generateToken } = require('../utils/tokenUtils');

class AuthController {
	registrationValidationRules() {
		return [
			body('email').isEmail(),
			body('username').trim().not().isEmpty(),
			body('password').trim().not().isEmpty(),
			body('passwordConfirm').trim().not().isEmpty()
		];
	}

	async registration(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { email, username, password, passwordConfirm } = req.body;
			const candidateEmail = await User.findOne({ where: { Email: email.toLowerCase() } });
			if (candidateEmail) {
				return next(ApiError.badRequest('User with this email already exists'));
			}
			const candidateName = await User.findOne({ where: { Username: username.toLowerCase() } });
			if (candidateName) {
				return next(ApiError.badRequest('User with this username already exists'));
			}
			if (passwordConfirm !== password) {
				return next(ApiError.badRequest('Passwords are not same'))
			}
			const hashPassword = await bcrypt.hash(password, 8);

			const newUser = await User.create({
				Email: email.toLowerCase(),
				Username: username.toLowerCase(),
				Password: hashPassword,
				LastAction: new Date()
			});

			const roleUser = await Role.findOne({ where: { RoleName: 'User' } });
			if (!roleUser) {
				return next(ApiError.internal('User role not found.'));
			}
			await newUser.addRole(roleUser);

			const token = generateToken(newUser.UserID, newUser.Role, newUser.Username);
			return res.status(201).json({ token });
		} catch (e) {
			return next(ApiError.internal(e.message));
		}
	}

	loginValidationRules() {
		return [
			body('username').not().isEmpty(),
			body('password').not().isEmpty()
		];
	}

	async login(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { username, password } = req.body;
			const user = await User.findOne({ where: { Username: username } });
			if (!user) {
				return next(ApiError.badRequest('User not found'));
			}
			const comparePassword = bcrypt.compareSync(password, user.Password);
			if (!comparePassword) {
				return next(ApiError.internal('Wrong username or password'));
			}
			if (user.Status === 'Blocked') {
				return next(ApiError.internal('Your account is blocked. Ask for permissions and try again later'));
			}
			await user.update({ LastAction: new Date() });

			const token = generateToken(user.UserID, user.Role, user.Username);
			return res.status(200).json({ token });
		} catch (e) {
			return next(ApiError.internal(e.message));
		}
	}
}

module.exports = new AuthController();

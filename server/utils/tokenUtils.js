const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const { User } = require('../models/models');

function generateToken(userID, userRole, userName) {
	return jwt.sign(
		{ userID: userID },
		process.env.JWT_SECRET_KEY,
		{ expiresIn: process.env.JWT_EXPIRES_IN }
	);
}

async function validateAndDecodeToken(req, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return next(ApiError.unauthorized('User is not logged in'));
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const user = await User.findByPk(decoded.userID);
		if (!user) {
			return next(ApiError.unauthorized('User not found'));
		}
		await user.update({ LastAction: new Date() });
		if (user.Status === 'Blocked') {
			return next(ApiError.forbidden('User is blocked. Contact to our service center for additional information.'));
		}
		return user;
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			return next(ApiError.unauthorized('Invalid token'));
		}
		next(ApiError.internal(e.message));
	}
}

module.exports = {
	generateToken,
	validateAndDecodeToken
};

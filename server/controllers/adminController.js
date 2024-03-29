const ApiError = require('../error/ApiError');
const { User, Role } = require('../models/models');
const { validateAndDecodeToken } = require('../utils/tokenUtils');

async function getUserByID(userID) {
	const user = await User.findByPk(userID, {
		attributes: { exclude: ['Password'] }
	}); if (!user) {
		throw ApiError.notFound('User not found');
	}
	return user;
}

class AdminController {
	async getAllUsers(req, res, next) {
		try {
			const users = await User.findAll({
				attributes: { exclude: ['Password'] }
			});
			res.status(200).json(users);
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async getOneUser(req, res, next) {
		try {
			const { userID } = req.params;
			console.log(userID);
			const user = await getUserByID(userID);
			res.status(200).json(user);
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async blockUser(req, res, next) {
		try {
			const { usersID } = req.params;
			const user = await getUserByID(usersID);
			await user.update({ Status: 'Blocked' }, { where: { UsersID: usersID } });
			res.status(200).json({ message: 'The user has been successfully blocked.' });
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async unBlockUser(req, res, next) {
		try {
			const { usersID } = req.params;
			const user = await getUserByID(usersID);
			await user.update({ Status: 'Active' }, { where: { UsersID: usersID } });
			res.status(200).json({ message: 'The user has been successfully unblocked.' });
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async deleteUser(req, res, next) {
		try {
			const { usersID } = req.params;
			console.log(usersID);
			const user = await getUserByID(usersID);
			await User.destroy({ where: { UserID: user.UserID } });
			res.status(200).json({ message: 'User deleted successfully' });
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async addAdminRole(req, res, next) {
		try {
			const { usersID } = req.params;
			const user = await getUserByID(usersID);
			//check on role Admin exist
			const roleAdmin = await Role.findOne({ where: { RoleName: 'Admin' } });
			if (!roleAdmin) {
				return next(ApiError.notFound('Admin role not found'));
			}

			const hasAdminRole = await user.hasRole(roleAdmin);
			if (hasAdminRole) {
				return next(ApiError.conflict('User already has the admin role'));
			}
			await user.addRole(roleAdmin);
			res.status(200).json({ message: 'Admin role successfully added' });
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async removeAdminRole(req, res, next) {
		try {
			const { usersID } = req.params;
			const user = await getUserByID(usersID);
			//check on role Admin exist
			const roleAdmin = await Role.findOne({ where: { RoleName: 'Admin' } });
			if (!roleAdmin) {
				return next(ApiError.notFound('Admin role not found'));
			}

			const hasAdminRole = await user.hasRole(roleAdmin);
			if (!hasAdminRole) {
				return next(ApiError.conflict('User does not have the admin role to remove'));
			}
			await user.removeRole(roleAdmin);
			res.status(200).json({ message: 'Admin role successfully removed' });
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	async isAdmin(req, res, next) {
		try {
			const user = await validateAndDecodeToken(req, next);
			const roles = await user.getRoles();
			await user.update({ LastAction: new Date() });
			const isAdmin = roles.some(role => role.RoleName === 'Admin');
			if (isAdmin) {
				next();
			} else {
				next(ApiError.forbidden('Access is denied. Administrator rights required.'));
			}
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
}

module.exports = {
	adminController: new AdminController(),
	getUserByID,
};
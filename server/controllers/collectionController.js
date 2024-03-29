const { Collection, ItemField, User, Item } = require('../models/models');
const sequelize = require('../db');
const ApiError = require('../error/ApiError');
const { validateAndDecodeToken } = require('../utils/tokenUtils');
const { body, validationResult } = require('express-validator');
const { getUserByID } = require('./adminController');


async function getCollectionByID(collectionID) {
	const collection = await Collection.findByPk(collectionID, {
		include: [{
			model: User,
			attributes: ['Username']
		}]
	}); if (!collection) {
		throw ApiError.notFound('Collection not found');
	}
	return collection;
}

class CollectionController {
	collectionValidationRules = () => {
		return [
			body('title').trim().not().isEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
			body('description').trim().isString().withMessage('Description must be a string'),
			body('theme').isString().withMessage('Theme must be a string'),
			body('imageURL').optional().isURL().withMessage('ImageURL must be a valid URL'),
			body('itemFields').optional().isArray().withMessage('ItemFields must be an array'),
			body('itemFields.*.fieldName').optional().isString().withMessage('Each fieldName must be a string'),
			body('itemFields.*.fieldType').optional().isString().withMessage('Each fieldType must be a string'),
		];
	};
	async getOneCollection(req, res, next) {
		try {
			const { collectionID } = req.params;
			const collection = await getCollectionByID(collectionID, { include: ['User'] });
			console.log(collection);
			if (!collection) {
				return next(ApiError.notFound(`Collection with ID ${collectionID} not found`));
			}

			res.status(200).json({ collection });
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	async createCollection(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return next(ApiError.badRequest(errors));
		}
		try {

			const { title, description, theme, imageURL, itemFields } = req.body;
			const user = await validateAndDecodeToken(req, next);
			const newCollection = await Collection.create({
				Title: title,
				Description: description,
				Theme: theme,
				ImageURL: imageURL,
			});
			await user.addCollection(newCollection);
			await newCollection.reload();

			if (itemFields?.length <= 3) {
				const fields = itemFields.map(field => ({
					...field,
					CollectionID: newCollection.CollectionID
				}));
				await ItemField.bulkCreate(fields);
			}
			res.status(201).json({
				message: 'Collection created successfully',
				collection: newCollection
			});
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	async updateCollection(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { title, description, theme, imageURL } = req.body;
			const { collectionID } = req.params;
			const collection = await getCollectionByID(collectionID);
			const user = await validateAndDecodeToken(req, next);
			if (user.UserID === collection.AuthorID || await user.hasRole('Admin')) {
				await collection.update({
					Title: title,
					Description: description,
					Theme: theme,
					ImageURL: imageURL,
				});
				return res.status(200).json({ message: 'Collection updated successfully' });
			} else {
				return next(ApiError.forbidden('You have to be the owner of the collection to update it'));
			}
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	async deleteCollection(req, res, next) {
		try {
			const { collectionID } = req.params;
			const collection = await getCollectionByID(collectionID);
			const user = await validateAndDecodeToken(req, next);
			const roles = await user.getRoles();

			if (user.UserID === collection.AuthorID || roles.some(role => role.RoleName === 'Admin')) {
				await Collection.destroy({ where: { CollectionID: collection.CollectionID } });
				return res.status(200).json({ message: 'Collection deleted successfully' });
			} else {
				return next(ApiError.forbidden('You have to be the owner of the collection to delete it'));
			}
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	// *----------------------------------------- rework later -------------------------------------------*
	async getAllCollections(req, res, next) {
		try {
			const { page = 1, limit = 20 } = req.query;
			const pageNumber = parseInt(page, 10);
			const limitNumber = parseInt(limit, 10);
			const options = {
				where: {},
				limit: limitNumber,
				offset: (pageNumber - 1) * limitNumber,
				order: [['createdAt', 'DESC']],
			};
			const collections = await Collection.findAll(options);
			res.json(collections);
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	async getAllUserCollections(req, res, next) {
		try {
			const { page = 1, limit = 20 } = req.query;
			const { userID } = req.params;
			const user = await getUserByID(userID);
			const pageNumber = parseInt(page, 10);
			const limitNumber = parseInt(limit, 10);
			const options = {
				where: { AuthorID: user.UserID },
				limit: limitNumber,
				offset: (pageNumber - 1) * limitNumber,
				order: [['createdAt', 'DESC']],
			};
			const collections = await Collection.findAll(options);
			res.json(collections);
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	async getCollectionsSortedByItemCount(req, res, next) {
		try {
			const collections = await Collection.findAll({
				attributes: {
					include: [
						[sequelize.fn('COUNT', sequelize.col('Items.ItemID')), 'ItemAmount']
					]
				},
				include: [
					{
						model: Item,
						attributes: [],
					},
					{
						model: User,
						attributes: ['Username'],
					}
				],
				group: ['Collection.CollectionID', 'User.UserID'],
				order: [
					[sequelize.literal('COUNT("Items"."ItemID")'), 'DESC']
				],
				raw: true,
			});

			res.status(200).json(collections);
		} catch (e) {
			next(ApiError.internal(e.message));
			console.error(e);
		}
	}


}

module.exports = {
	collectionController: new CollectionController(),
	getCollectionByID,
};
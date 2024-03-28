const { Collection, Item, ItemField, ItemFieldValue, User, Tag, ItemTags } = require('../models/models');
const ApiError = require('../error/ApiError');
const { getCollectionByID } = require('./collectionController');
const { validateAndDecodeToken } = require('../utils/tokenUtils');
const { body, validationResult } = require('express-validator');

async function verifyPermission(user, collection, next) {
	const roles = await user.getRoles();
	if (!(user.UserID === collection.AuthorID || roles.some(role => role.RoleName === 'Admin'))) {
		return false;
	}
	return true;
}

async function getItemByID(itemID) {
	const item = await Item.findByPk(itemID);
	if (!item) {
		throw ApiError.notFound('Item not found');
	}
	return item;
}
function isValueTypeValid(value, fieldType) {
	switch (fieldType) {
		case 'Integer':
			return !isNaN(value) && parseInt(value).toString() === value.toString();
		case 'String':
		case 'Text':
			return typeof value === 'string' || value instanceof String;
		case 'Boolean':
			return value === 'true' || value === 'false' || typeof value === 'boolean';
		case 'Date':
			const date = Date.parse(value);
			return !isNaN(date);
		default:
			return false;
	}
}
class ItemController {
	itemValidationRules() {
		return [
			body('title').trim().not().isEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
			body('imageURL').optional().isURL().withMessage('ImageURL must be a valid URL'),
			body('tags').optional().isArray().withMessage('ItemFields must be an array'),
			body('tags.*.tagName').optional().isString().withMessage('Each fieldName must be a string'),
			body('itemFieldsValues').optional().isArray().withMessage('ItemFieldsValue must be an array'),
			body('itemFieldsValues.*.tagName').optional().isString().withMessage('Each fieldName must be a string'),

		];
	}
	async getAllItems(req, res, next) {
		try {
			const items = await Item.findAll({
				where: {
					Hidden: false
				},
				include: [{
					model: Collection,
					attributes: ['Title'],
					include: [
						{
							model: User,
							attributes: ['Username'],
						}
					]
				}],
				order: [
					['createdAt', 'DESC']
				],
			});

			res.status(200).json(items);
		} catch (e) {
			console.error(e);
			next(ApiError(e.message));
		}
	}
	async getOneItem(req, res, next) {
		try {
			const { itemID } = req.params;
			const item = await getItemByID(itemID);
			const collection = await getCollectionByID(item.CollectionID);
			const user = await validateAndDecodeToken(req, next);
			const isVerified = await verifyPermission(user, collection, next)
			if (item.Hidden) {
				if (isVerified) {
					res.status(200).json(item);
				}
				else {
					next(ApiError.notFound('Item not found'))
				}
			}
			res.status(200).json(item);
		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async getAllItemsInCollection(req, res, next) {
		try {
			const { collectionID } = req.params;
			const collection = await getCollectionByID(collectionID);
			const user = await validateAndDecodeToken(req, next);
			const isVerified = await verifyPermission(user, collection, next);
			if (isVerified) {
				const items = await Item.findAll({
					where: {
						CollectionID: collectionID,
					}
				});
				res.status(200).json(items);
			}
			const items = await Item.findAll({
				where: {
					CollectionID: collectionID,
					Hidden: false,
				},
			});
			res.status(200).json(items);

		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}

	async updateItem(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { itemID } = req.params;
			const { title, hidden, imageURL, tags, values } = req.body;
			const item = await getItemByID(itemID);
			const collection = await getCollectionByID(item.CollectionID);
			const user = await validateAndDecodeToken(req, next);
			const isVerified = await verifyPermission(user, collection, next);
			if (!isVerified) {
				next(ApiError.forbidden('Only collection owner can update item'));
			}
			await updateItemDetails({ itemID, title, hidden, imageURL });
			await updateValuesForItem(values, item.CollectionID, itemID, next);
			await updateTagsForItem(tags, itemID);

			const updatedItem = await Item.findByPk(itemID);
			res.json(updatedItem);
		} catch (e) {
			next(ApiError.internal(e.message));
		}
		async function updateItemDetails({ itemID, title, hidden, imageURL }) {
			await Item.update({ Title: title, Hidden: hidden, ImageURL: imageURL }, { where: { ItemID: itemID } });
		}

		async function updateValuesForItem(values, collectionID, itemID, next) {
			const collectionItemsFields = await ItemField.findAll({ where: { CollectionID: collectionID } });

			for (const field of collectionItemsFields) {
				const value = values[field.FieldName];
				if (value === undefined) {
					continue; // Пропускаем поля, для которых значения не были предоставлены
				}

				if (!isValueTypeValid(value, field.FieldType)) {
					return next(ApiError.badRequest(`Invalid type for field: ${field.FieldName}, expected: ${field.FieldType}`));
				}

				await ItemFieldValue.upsert({ FieldID: field.FieldID, ItemID: itemID, Value: value });
			}
		}

		async function updateTagsForItem(tags, itemID) {
			await ItemTags.destroy({ where: { ItemID: itemID } });

			if (tags && tags.length > 0) {
				for (const tagName of tags) {
					let tag = await Tag.findOne({ where: { TagName: tagName } });
					if (!tag) {
						tag = await Tag.create({ TagName: tagName });
					}
					await ItemTags.create({ ItemID: itemID, TagID: tag.TagID });
				}
			}
		}
	}

	async deleteItem(req, res, next) {
		try {
			const { itemID } = req.params;
			const item = await getItemByID(itemID);
			const collection = await getCollectionByID(item.CollectionID);
			const user = await validateAndDecodeToken(req, next);
			const isVerified = await verifyPermission(user, collection, next);
			if (!isVerified) {
				next(ApiError.forbidden('Only owner of collection can delete item'));
			}
			await Item.destroy({ where: { ItemID: itemID } });
			res.status(200).json({ message: 'Item deleted successfully' })

		} catch (e) {
			next(ApiError.internal(e.message));
		}
	}
	async createItem(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { title, hidden, imageURL, tags, values } = req.body;
			const { collectionID } = req.params;
			const collection = await getCollectionByID(collectionID);
			const user = await validateAndDecodeToken(req, next);
			await verifyPermission(user, collection, next);
			const newItem = await addNewItem({ title, hidden, imageURL, collection });
			await addValuesToItem(values, collection.CollectionID, newItem.ItemID, next);
			await addTagsToItem(tags, newItem.ItemID);
			res.json(newItem);
		} catch (e) {
			next(ApiError.internal(e.message));
		}

		async function addNewItem({ title, hidden, imageURL, collection }) {
			const newItem = await Item.create({ Title: title, Hidden: hidden, ImageURL: imageURL, CollectionID: collection.CollectionID });
			await collection.addItems(newItem);
			console.log(collection);
			return newItem;
		}

		async function addValuesToItem(values, collectionID, newItemID, next) {
			const collectionItemsFields = await ItemField.findAll({ where: { CollectionID: collectionID } });

			if (collectionItemsFields.length !== Object.keys(values).length) {
				return next(ApiError.badRequest('The number of fields and values does not match.'));
			}

			for (const field of collectionItemsFields) {
				const value = values[field.FieldName];
				if (value === undefined) {
					return next(ApiError.badRequest(`Missing value for field: ${field.FieldName}`));
				}

				if (!isValueTypeValid(value, field.FieldType)) {
					return next(ApiError.badRequest(`Invalid type for field: ${field.FieldName}, expected: ${field.FieldType}`));
				}

				await ItemFieldValue.create({ FieldID: field.FieldID, ItemID: newItemID, Value: value });
			}
		}

		async function addTagsToItem(tags, newItemID) {
			if (tags && tags.length > 0) {
				for (const tagName of tags) {
					let tag = await Tag.findOne({ where: { TagName: tagName } });
					if (!tag) {
						tag = await Tag.create({ TagName: tagName });
					}
					await ItemTags.create({ ItemID: newItemID, TagID: tag.TagID });
				}
			}
		}
	}

}

module.exports = new ItemController();

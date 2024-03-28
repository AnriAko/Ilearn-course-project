/*
/-------- API Routes --------/

authRoutes ('/auth') ----------------------------------------------------------/
post('/auth/signup'), values: email, username, password, passwordConfirm
post('/auth/login'), values: username, password.

adminRoutes ('/admin') ----------------------------------------------------------/
get('/admin/collections/:id/items') to get all(even hidden) items

get('/admin/users') get all users
get('/admin/users/:usersID') get one user
patch('/admin/users/:usersID/block') block user
patch('/admin/users/:usersID/unblock') unblock user
patch('/admin/users/:usersID/addAdmin') add admin role to user
patch('/admin/users/:usersID/removeAdmin') remove admin role to user
router.delete('/admin/users/:usersID') delete user with all his collections, items, comments and likes

collectionRoutes('/collection') ----------------------------------------------------------/
get('/collection/') get all collections
get('/collection/:collectionID') get one collection
get('/biggest-collections') get collections sorted by items amount
get('/collection/users-collection/:userID') get all one users collection
post('/collection/') create collection, values: title, description, theme, imageURL, itemFields
where itemFields is array of field objects
Example:
{
  "title": "Collection title",
  "description": "A collection bla bla",
  "theme": "Coins",
  "imageURL": "https://example.com/image.jpg",
  "itemFields": [
	{
	  "FieldName": "Country",
	  "FieldType": "String"
	},
	{
	  "FieldName": "Year",
	  "FieldType": "Integer"
	},
	{
	  "FieldName": "Material",
	  "FieldType": "String"
	}
  ]
}
patch('/collection/:collectionID') update collection, values title, description, theme, imageURL. Cannot update itemFields
delete('/collection/:collectionID') delete one collection
 

itemRoutes('/collections/:collectionID/items') ----------------------------------------------------------
get('/allItems
get('/collections/:collectionID/items/') get all items in the collection
get('/collections/:collectionID/items/:itemID') get one item
post('/collections/:collectionID/items/') create item, values: title, hidden, imageURL, tags, values, where tags and values are arrays.
Example:
{
	"title": "Item name",
	"hidden": false,
	"imageURL": "http://example.com/image.jpg",
	"collectionID": 1,
	"tags": ["Tag1", "Tag2"],
	"values": {
		"FieldName1": "Value1",
		"FieldName2": 123,
		"FieldName3": true
	}
}
patch('/collections/:collectionID/items/:itemID') update item. Same request as create item. Watch above
delete('/collections/:collectionID/items/:itemID') delete item

----------------------------- Comments ('/collections/:collectionID/items/itemID/comments' -----------------------------
Not done yet

----------------------------- Likes ('/collections/:collectionID/items/itemID/likes') -----------------------------
Not done yet

*/

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const collectionRoutes = require('./collectionRoutes');
const itemRoutes = require('./itemRoutes');
const commonRoutes = require('./commonRoutes');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/collections', collectionRoutes);
router.use('/collections/:collectionID/items', itemRoutes);

router.use('/', commonRoutes);
module.exports = router;
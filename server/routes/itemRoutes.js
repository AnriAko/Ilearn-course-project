const express = require('express');
const router = express.Router({ mergeParams: true });
const itemController = require('../controllers/itemController');

router.get('/:itemID', itemController.getOneItem);
router.get('/', itemController.getAllItemsInCollection);
router.get('/allItems', itemController.getAllItems);
router.post('/', itemController.createItem);
router.patch('/:itemID', itemController.updateItem);
router.delete('/:itemID', itemController.deleteItem);

module.exports = router;
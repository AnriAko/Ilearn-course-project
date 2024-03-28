const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers/adminController');
const { getAllItemsInCollection: getAllItems } = require('../controllers/itemController');

const { isAdmin } = adminController;
router.get('/collections/:id/items', isAdmin, getAllItems);

router.get('/users', isAdmin, adminController.getAllUsers);
router.get('/users/:usersID', isAdmin, adminController.getOneUser);
router.patch('/users/:usersID/block', isAdmin, adminController.blockUser);
router.patch('/users/:usersID/unblock', isAdmin, adminController.unBlockUser);
router.patch('/users/:usersID/addAdmin', isAdmin, adminController.addAdminRole);
router.patch('/users/:usersID/removeAdmin', isAdmin, adminController.removeAdminRole);

router.delete('/users/:usersID', isAdmin, adminController.deleteUser);


module.exports = router;
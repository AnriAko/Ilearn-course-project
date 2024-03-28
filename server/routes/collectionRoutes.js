const express = require('express');
const router = express.Router();
const { collectionController } = require('../controllers/collectionController');

router.get('/', collectionController.getAllCollections);
router.get('/users-collection/:userID', collectionController.getAllUserCollections);
router.get('/biggest', collectionController.getCollectionsSortedByItemCount);

router.post('/', collectionController.collectionValidationRules(), collectionController.createCollection);

router.get('/:collectionID', collectionController.getOneCollection);
router.patch('/:collectionID', collectionController.collectionValidationRules(), collectionController.updateCollection);
router.delete('/:collectionID', collectionController.deleteCollection);


module.exports = router;
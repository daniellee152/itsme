const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router
  .route('/')
  .get(shopController.getCollections)
  .post(shopController.createCollections);

router.route('/:collectionId').get(shopController.getCollection);

module.exports = router;

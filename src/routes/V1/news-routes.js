const express = require('express');
const router = express.Router();
const { NewsValidate } = require('../../middlewares');
const { handleFileUpload } = require('../../middlewares/upload-middleware');
const newsValidationSchema = require('../../validation/newsValidation');
const { NewsController } = require('../../controllers');

router.post('/', handleFileUpload, NewsController.createNews);
router.get('/', NewsController.getAllNews);
router.get('/:id', NewsController.getNewsById);
router.put('/:id', handleFileUpload, NewsController.updateNews);
router.delete('/:id', NewsController.deleteNews);

module.exports = router;

const express = require('express');
const cropReportController = require('../../controllers/crop-report-controller');
const { upload } = require('../../middlewares/upload-middleware');

const router = express.Router();

// Create a new crop report
router.post('/', cropReportController.create);

// Get all crop reports (admin)
router.get('/', cropReportController.getAll);

// Get crop reports by farmer ID
router.get('/farmer/:farmerId', cropReportController.getByFarmer);

// Get crop report by ID
router.get('/:id', cropReportController.getById);

// Update crop report
router.put('/:id', cropReportController.update);

// Delete crop report
router.delete('/:id', cropReportController.delete);

// Add photo to crop stage
router.post('/stages/:cropStageId/photos', upload.single('photo'), cropReportController.addStagePhoto);

// Remove a stage photo
router.delete('/stages/:cropStageId/photos/:photoId', cropReportController.deleteStagePhoto);

// Update stage status
router.put('/stages/:cropStageId/status', cropReportController.updateStageStatus);

// Add custom stage to crop report
router.post('/:cropReportId/stages', cropReportController.addCustomStage);

module.exports = router;

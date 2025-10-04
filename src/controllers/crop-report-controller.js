const { StatusCodes } = require('http-status-codes');
const successResponse = require('../utills/common/success-response');
const cropReportService = require('../services/crop-report-service');

class CropReportController {
  async create(req, res) {
    try {
      const { farmerId } = req.body;
      const { cropName, cropType, areaHectares, plantingDate, expectedHarvestDate, description } = req.body;

      if (!farmerId || !cropName) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Farmer ID and crop name are required',
          data: null,
        });
      }

      const cropReport = await cropReportService.createCropReport(farmerId, {
        cropName,
        cropType,
        areaHectares,
        plantingDate,
        expectedHarvestDate,
        description
      });

      return res.status(StatusCodes.CREATED).json(successResponse('Crop report created successfully', cropReport));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getByFarmer(req, res) {
    try {
      const { farmerId } = req.params;
      const cropReports = await cropReportService.getCropReportsByFarmer(farmerId);
      return res.status(StatusCodes.OK).json(successResponse('Crop reports retrieved successfully', cropReports));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getAll(req, res) {
    try {
      const cropReports = await cropReportService.getAllCropReports();
      return res.status(StatusCodes.OK).json(successResponse('All crop reports retrieved successfully', cropReports));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const cropReport = await cropReportService.getCropReportById(id);
      return res.status(StatusCodes.OK).json(successResponse('Crop report retrieved successfully', cropReport));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const cropReport = await cropReportService.updateCropReport(id, updateData);
      return res.status(StatusCodes.OK).json(successResponse('Crop report updated successfully', cropReport));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await cropReportService.deleteCropReport(id);
      return res.status(StatusCodes.OK).json(successResponse(result.message, null));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async addStagePhoto(req, res) {
    try {
      const { cropStageId } = req.params;
      const { photoDescription } = req.body;
      
      // Get the uploaded file path from multer
      const photoPath = req.file ? req.file.filename : null;
      
      if (!photoPath) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Photo file is required',
          data: null,
        });
      }

      const photo = await cropReportService.addStagePhoto(cropStageId, photoPath, photoDescription);
      return res.status(StatusCodes.CREATED).json(successResponse('Stage photo added successfully', photo));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async deleteStagePhoto(req, res) {
    try {
      const { cropStageId, photoId } = req.params;
      const result = await cropReportService.deleteStagePhoto(cropStageId, photoId);
      return res.status(StatusCodes.OK).json(successResponse(result.message, null));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async updateStageStatus(req, res) {
    try {
      const { cropStageId } = req.params;
      const { isCompleted, stageDate } = req.body;
      
      const stage = await cropReportService.updateStageStatus(cropStageId, isCompleted, stageDate);
      return res.status(StatusCodes.OK).json(successResponse('Stage status updated successfully', stage));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async addCustomStage(req, res) {
    try {
      const { cropReportId } = req.params;
      const { stageName, stageOrder, description } = req.body;
      
      if (!stageName || !stageOrder) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Stage name and order are required',
          data: null,
        });
      }

      const stage = await cropReportService.addCustomStage(cropReportId, stageName, stageOrder, description);
      return res.status(StatusCodes.CREATED).json(successResponse('Custom stage added successfully', stage));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new CropReportController();

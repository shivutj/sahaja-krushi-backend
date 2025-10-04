const { StatusCodes } = require('http-status-codes');
const { CropReport, CropStage, CropStagePhoto, Farmer } = require('../models');
const AppError = require('../utills/app-error');

// Predefined crop stages in Kannada
const PREDEFINED_STAGES = [
  { 
    name: 'ಭೂಮಿ ಸಿದ್ಧತೆ', 
    nameEnglish: 'Land Preparation',
    order: 1, 
    description: 'Soil preparation and field setup for planting' 
  },
  { 
    name: 'ಬಿತ್ತನೆ', 
    nameEnglish: 'Sowing',
    order: 2, 
    description: 'Planting seeds or seedlings in the prepared field' 
  },
  { 
    name: 'ಬೆಳವಣಿಗೆ', 
    nameEnglish: 'Growth',
    order: 3, 
    description: 'Crop development and growth stage' 
  },
  { 
    name: 'ಉತ್ಪಾದನೆ', 
    nameEnglish: 'Production',
    order: 4, 
    description: 'Flowering and fruit/seed development stage' 
  },
  { 
    name: 'ಕೊಯ್ಲು', 
    nameEnglish: 'Harvest',
    order: 5, 
    description: 'Ready for harvest and collection' 
  }
];

async function createCropReport(farmerId, data) {
  const { cropName, cropType, areaHectares, plantingDate, expectedHarvestDate, description } = data;
  
  const cropReport = await CropReport.create({
    farmerId,
    cropName,
    cropType,
    areaHectares,
    plantingDate,
    expectedHarvestDate,
    description,
    status: 'active'
  });

  // Create predefined stages for the crop report
  const stages = PREDEFINED_STAGES.map(stage => ({
    cropReportId: cropReport.id,
    stageName: stage.name,
    stageOrder: stage.order,
    description: stage.description,
    isCompleted: false
  }));

  await CropStage.bulkCreate(stages);

  return cropReport;
}

async function getCropReportsByFarmer(farmerId) {
  const cropReports = await CropReport.findAll({
    where: { farmerId },
    include: [
      {
        model: CropStage,
        as: 'stages',
        include: [
          {
            model: CropStagePhoto,
            as: 'photos'
          }
        ],
        order: [['stageOrder', 'ASC']]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return cropReports;
}

async function getAllCropReports() {
  const cropReports = await CropReport.findAll({
    include: [
      {
        model: Farmer,
        as: 'farmer',
        attributes: ['id', 'farmerId', 'fullName', 'contactNumber', 'district', 'state']
      },
      {
        model: CropStage,
        as: 'stages',
        include: [
          {
            model: CropStagePhoto,
            as: 'photos'
          }
        ],
        order: [['stageOrder', 'ASC']]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return cropReports;
}

async function getCropReportById(id) {
  const cropReport = await CropReport.findByPk(id, {
    include: [
      {
        model: Farmer,
        as: 'farmer',
        attributes: ['id', 'farmerId', 'fullName', 'contactNumber', 'district', 'state']
      },
      {
        model: CropStage,
        as: 'stages',
        include: [
          {
            model: CropStagePhoto,
            as: 'photos'
          }
        ],
        order: [['stageOrder', 'ASC']]
      }
    ]
  });

  if (!cropReport) {
    throw new AppError('Crop report not found', StatusCodes.NOT_FOUND);
  }

  return cropReport;
}

async function updateCropReport(id, data) {
  const cropReport = await CropReport.findByPk(id);
  if (!cropReport) {
    throw new AppError('Crop report not found', StatusCodes.NOT_FOUND);
  }

  await cropReport.update(data);
  return cropReport;
}

async function deleteCropReport(id) {
  const cropReport = await CropReport.findByPk(id);
  if (!cropReport) {
    throw new AppError('Crop report not found', StatusCodes.NOT_FOUND);
  }

  await cropReport.destroy();
  return { message: 'Crop report deleted successfully' };
}

async function addStagePhoto(cropStageId, photoPath, photoDescription) {
  const cropStage = await CropStage.findByPk(cropStageId);
  if (!cropStage) {
    throw new AppError('Crop stage not found', StatusCodes.NOT_FOUND);
  }

  const photo = await CropStagePhoto.create({
    cropStageId,
    photoPath,
    photoDescription,
    uploadedAt: new Date()
  });

  return photo;
}

async function deleteStagePhoto(cropStageId, photoId) {
  const photo = await CropStagePhoto.findOne({ where: { id: photoId, cropStageId } });
  if (!photo) {
    throw new AppError('Stage photo not found', StatusCodes.NOT_FOUND);
  }
  await photo.destroy();
  return { message: 'Stage photo removed' };
}

async function updateStageStatus(cropStageId, isCompleted, stageDate) {
  const cropStage = await CropStage.findByPk(cropStageId);
  if (!cropStage) {
    throw new AppError('Crop stage not found', StatusCodes.NOT_FOUND);
  }

  await cropStage.update({
    isCompleted,
    stageDate: stageDate || (isCompleted ? new Date() : null)
  });

  return cropStage;
}

async function addCustomStage(cropReportId, stageName, stageOrder, description) {
  const cropReport = await CropReport.findByPk(cropReportId);
  if (!cropReport) {
    throw new AppError('Crop report not found', StatusCodes.NOT_FOUND);
  }

  const stage = await CropStage.create({
    cropReportId,
    stageName,
    stageOrder,
    description,
    isCompleted: false
  });

  return stage;
}

module.exports = {
  createCropReport,
  getCropReportsByFarmer,
  getAllCropReports,
  getCropReportById,
  updateCropReport,
  deleteCropReport,
  addStagePhoto,
  deleteStagePhoto,
  updateStageStatus,
  addCustomStage
};

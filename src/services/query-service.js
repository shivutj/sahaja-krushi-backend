const { Query, Farmer } = require('../models');
const models = require('../models');
const { AppError } = require('../utills/app-error');
const { StatusCodes } = require('http-status-codes');

async function resolveFarmerNumericId(farmerIdString) {
  if (!farmerIdString) {
    throw new AppError('farmerId is required', StatusCodes.BAD_REQUEST);
  }
  const farmer = await Farmer.findOne({ where: { farmerId: farmerIdString } });
  if (!farmer) {
    throw new AppError('Farmer not found', StatusCodes.NOT_FOUND);
  }
  return { farmerDbId: farmer.id, farmerInstance: farmer };
}

async function createQuery({ title, description, farmerIdString, imagePath, audioPath, videoPath }) {
  const { farmerDbId } = await resolveFarmerNumericId(farmerIdString);
  const created = await Query.create({
    title: title || null,
    description: description || null,
    imagePath: imagePath || null,
    audioPath: audioPath || null,
    videoPath: videoPath || null,
    farmerId: farmerDbId,
    status: 'open',
  });
  return created;
}

async function listAll() {
  return Query.findAll({ order: [['createdAt', 'DESC']], include: [{ model: Farmer, as: 'farmer' }] });
}

async function listByFarmerIdString(farmerIdString) {
  const { farmerDbId } = await resolveFarmerNumericId(farmerIdString);
  return Query.findAll({ where: { farmerId: farmerDbId }, order: [['createdAt', 'DESC']] });
}

async function getOne(id) {
  const item = await Query.findByPk(id, { include: [{ model: Farmer, as: 'farmer' }] });
  if (!item) throw new AppError('Query not found', StatusCodes.NOT_FOUND);
  return item;
}

async function answerQuery(id, { answer, status }) {
  const item = await Query.findByPk(id);
  if (!item) throw new AppError('Query not found', StatusCodes.NOT_FOUND);
  item.answer = answer ?? item.answer;
  if (status && ['open', 'answered', 'closed', 'escalated'].includes(status)) {
    item.status = status;
  } else if (answer && !status) {
    item.status = 'answered';
  }
  await item.save();
  return item;
}

async function escalateQuery(id) {
  const item = await Query.findByPk(id);
  if (!item) throw new AppError('Query not found', StatusCodes.NOT_FOUND);
  // Only escalate if not already closed
  if (item.status === 'closed') {
    return item;
  }
  item.status = 'escalated';
  item.escalatedAt = new Date();
  await item.save();
  return item;
}

async function listAllWithStatus(status) {
  const where = status ? { status } : undefined;
  return Query.findAll({ where, order: [['createdAt', 'DESC']], include: [{ model: Farmer, as: 'farmer' }] });
}

async function listAnswered() {
  const items = await Query.findAll({
    where: {
      status: ['answered', 'closed'],
      answer: {
        [require('sequelize').Op.ne]: null
      }
    },
    include: [{
      model: require('../models').Farmer,
      as: 'farmer',
      attributes: ['id', 'farmerId', 'fullName', 'contactNumber', 'district', 'state']
    }],
    order: [['updatedAt', 'DESC']]
  });
  return items;
}

async function listEscalated() {
  const items = await Query.findAll({
    where: {
      escalatedAt: {
        [require('sequelize').Op.ne]: null,
      },
    },
    include: [{
      model: require('../models').Farmer,
      as: 'farmer',
      attributes: ['id', 'farmerId', 'fullName', 'contactNumber', 'district', 'state'],
    }],
    order: [['escalatedAt', 'DESC']],
  });
  return items;
}

module.exports = {
  createQuery,
  listAll,
  listByFarmerIdString,
  getOne,
  answerQuery,
  listAnswered,
  escalateQuery,
  listAllWithStatus,
  listEscalated,
  async getAdminContacts() {
    const { User } = models;
    const admins = await User.findAll({
      where: {
        role: ['ADMIN', 'SUPER_ADMIN'],
        isActive: true,
      },
      attributes: ['id', 'username', 'email', 'phone', 'role'],
      order: [['role', 'ASC'], ['username', 'ASC']],
    });
    return admins;
  }
};

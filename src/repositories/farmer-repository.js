const { Farmer } = require('../models');
const { Op } = require('sequelize');

class FarmerRepository {
  async create(data) {
    try {
      const farmer = await Farmer.create(data);
      return farmer;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const farmer = await Farmer.findByPk(id);
      return farmer;
    } catch (error) {
      throw error;
    }
  }

  async findByFarmerId(farmerId) {
    try {
      const farmer = await Farmer.findOne({
        where: { farmerId }
      });
      return farmer;
    } catch (error) {
      throw error;
    }
  }

  async findLatestByFarmerIdPrefix(prefix) {
    try {
      const latest = await Farmer.findOne({
        where: { farmerId: { [Op.like]: `${prefix}%` } },
        order: [['farmerId', 'DESC']],
      });
      return latest;
    } catch (error) {
      throw error;
    }
  }

  async findByContactNumber(contactNumber) {
    try {
      const farmer = await Farmer.findOne({
        where: { contactNumber }
      });
      return farmer;
    } catch (error) {
      throw error;
    }
  }

  async findByAadharNumber(aadharNumber) {
    try {
      const farmer = await Farmer.findOne({
        where: { aadharNumber }
      });
      return farmer;
    } catch (error) {
      throw error;
    }
  }

  async findAll(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      if (filters.state) {
        whereClause.state = filters.state;
      }
      
      if (filters.district) {
        whereClause.district = filters.district;
      }
      
      if (filters.search) {
        whereClause[Op.or] = [
          { fullName: { [Op.like]: `%${filters.search}%` } },
          { farmerId: { [Op.like]: `%${filters.search}%` } },
          { contactNumber: { [Op.like]: `%${filters.search}%` } }
        ];
      }

      const { count, rows } = await Farmer.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        farmers: rows,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const [updatedRowsCount] = await Farmer.update(data, {
        where: { id }
      });
      
      if (updatedRowsCount === 0) {
        return null;
      }
      
      const updatedFarmer = await Farmer.findByPk(id);
      return updatedFarmer;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const deletedRowsCount = await Farmer.destroy({
        where: { id }
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async updateLastLogin(id) {
    try {
      await Farmer.update(
        { lastLoginDate: new Date() },
        { where: { id } }
      );
    } catch (error) {
      throw error;
    }
  }

  async getStats() {
    try {
      const totalFarmers = await Farmer.count();
      const activeFarmers = await Farmer.count({ where: { isActive: true } });
      const farmersByState = await Farmer.findAll({
        attributes: [
          'state',
          [Farmer.sequelize.fn('COUNT', Farmer.sequelize.col('id')), 'count']
        ],
        group: ['state'],
        raw: true
      });

      return {
        totalFarmers,
        activeFarmers,
        farmersByState
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FarmerRepository();

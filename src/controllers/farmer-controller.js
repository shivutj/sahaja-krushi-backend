const farmerService = require('../services/farmer-service');
const successResponse = require('../utills/common/success-response');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utills/common/app-error');

class FarmerController {
  async registerFarmer(req, res) {
    try {
      console.log('Registration request received:', JSON.stringify(req.body, null, 2));
      
      const farmer = await farmerService.registerFarmer(req.body);
      
      return res.status(StatusCodes.CREATED).json(
        successResponse('Farmer registered successfully', {
          farmerId: farmer.farmerId,
          fullName: farmer.fullName,
          contactNumber: farmer.contactNumber,
          registrationDate: farmer.registrationDate
        })
      );
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error stack:', error.stack);
      
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  async getFarmerById(req, res) {
    try {
      const { id } = req.params;
      const farmer = await farmerService.getFarmerById(id);
      
      return res.status(StatusCodes.OK).json(
        successResponse('Farmer details fetched successfully', farmer)
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  async getFarmerByFarmerId(req, res) {
    try {
      const { farmerId } = req.params;
      const farmer = await farmerService.getFarmerByFarmerId(farmerId);
      
      return res.status(StatusCodes.OK).json(
        successResponse('Farmer details fetched successfully', farmer)
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  async getAllFarmers(req, res) {
    try {
      const { page = 1, limit = 10, state, district, search } = req.query;
      
      const filters = {};
      if (state) filters.state = state;
      if (district) filters.district = district;
      if (search) filters.search = search;

      const pagination = { page, limit };
      const result = await farmerService.getAllFarmers(filters, pagination);
      
      return res.status(StatusCodes.OK).json(
        successResponse('Farmers fetched successfully', result)
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  async updateFarmer(req, res) {
    try {
      const { id } = req.params;
      const farmer = await farmerService.updateFarmer(id, req.body);
      
      return res.status(StatusCodes.OK).json(
        successResponse('Farmer updated successfully', farmer)
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  async deleteFarmer(req, res) {
    try {
      const { id } = req.params;
      const deleted = await farmerService.deleteFarmer(id);
      
      return res.status(StatusCodes.OK).json(
        successResponse('Farmer deleted successfully', { deleted })
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  async loginFarmer(req, res) {
    try {
      const { contactNumber, dateOfBirth, otpVerified, firebaseUid, username } = req.body;
      
      let farmer;
      if (otpVerified && firebaseUid) {
        // OTP-based login
        farmer = await farmerService.loginFarmerWithOtp(contactNumber, firebaseUid);
      } else if (username) {
        // Username-based login
        farmer = await farmerService.loginFarmerWithUsername(contactNumber, username);
      } else if (dateOfBirth) {
        // Legacy DOB-based login (for backward compatibility)
        farmer = await farmerService.loginFarmerWithDob(contactNumber, dateOfBirth);
      } else {
        throw new AppError('Either username, OTP verification, or date of birth is required', StatusCodes.BAD_REQUEST);
      }
      
      return res.status(StatusCodes.OK).json(
        successResponse('Farmer logged in successfully', {
          farmerId: farmer.farmerId,
          fullName: farmer.fullName,
          contactNumber: farmer.contactNumber,
          state: farmer.state,
          district: farmer.district,
          lastLoginDate: farmer.lastLoginDate
        })
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  async sendOtp(req, res) {
    try {
      const { contactNumber } = req.body;
      const result = await farmerService.sendOtp(contactNumber);
      
      return res.status(StatusCodes.OK).json(
        successResponse('OTP sent successfully', {
          contactNumber: result.contactNumber,
          message: result.message,
          // Expose OTP only in non-production environments for testing
          otp: process.env.NODE_ENV !== 'production' ? result.otp : undefined
        })
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  async getFarmerStats(req, res) {
    try {
      const stats = await farmerService.getFarmerStats();
      
      return res.status(StatusCodes.OK).json(
        successResponse('Farmer statistics fetched successfully', stats)
      );
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
}

module.exports = new FarmerController();

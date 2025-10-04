const farmerRepository = require('../repositories/farmer-repository');
const { AppError } = require('../utills/app-error');
const { StatusCodes } = require('http-status-codes');

class FarmerService {
  async registerFarmer(data) {
    try {
      // Check if farmer already exists with same contact number or Aadhar
      if (data.contactNumber) {
        const existingFarmerByContact = await farmerRepository.findByContactNumber(data.contactNumber);
        if (existingFarmerByContact) {
          throw new AppError('Farmer with this contact number already exists', StatusCodes.CONFLICT);
        }
      }

      if (data.aadharNumber) {
        const existingFarmerByAadhar = await farmerRepository.findByAadharNumber(data.aadharNumber);
        if (existingFarmerByAadhar) {
          throw new AppError('Farmer with this Aadhar number already exists', StatusCodes.CONFLICT);
        }
      }

      // Auto-generate farmerId if missing: FARMER-YYYY-XXX
      if (!data.farmerId) {
        const year = new Date().getFullYear();
        const prefix = `FARMER-${year}-`;
        // Try sequential numbers starting from 001
        let seq = 1;
        let candidate = `${prefix}${String(seq).padStart(3, '0')}`;
        // eslint-disable-next-line no-await-in-loop
        while (await farmerRepository.findByFarmerId(candidate)) {
          seq += 1;
          candidate = `${prefix}${String(seq).padStart(3, '0')}`;
          if (seq > 9999) break;
        }
        data.farmerId = candidate;
      } else {
        // Ensure unique farmerId if provided and collides
        const exists = await farmerRepository.findByFarmerId(data.farmerId);
        if (exists) {
          // Auto-increment suffix for duplicates: e.g., FARMER-2025-003 -> FARMER-2025-003-1, -2, ...
          const base = data.farmerId;
          let suffix = 1;
          let candidate = `${base}-${suffix}`;
          // Try up to 50 to avoid infinite loops
          // eslint-disable-next-line no-await-in-loop
          while (await farmerRepository.findByFarmerId(candidate)) {
            suffix += 1;
            candidate = `${base}-${suffix}`;
            if (suffix > 50) break;
          }
          data.farmerId = candidate;
        }
      }

      // Create farmer
      const farmer = await farmerRepository.create(data);
      return farmer;
    } catch (error) {
      // Log original error for debugging
      // eslint-disable-next-line no-console
      console.error('[FarmerService.registerFarmer] Error:', error);

      if (error instanceof AppError) {
        throw error;
      }

      // Handle Sequelize specific errors for better messages
      if (error?.name === 'SequelizeUniqueConstraintError') {
        const fields = error?.errors?.map(e => e?.path).filter(Boolean) || [];
        const isFarmerId = fields.includes('farmerId');
        if (isFarmerId) {
          // Retry once by regenerating a unique farmerId
          try {
            const year = new Date().getFullYear();
            const prefix = `FARMER-${year}-`;
            let seq = 1;
            let candidate = `${prefix}${String(seq).padStart(3, '0')}`;
            // eslint-disable-next-line no-await-in-loop
            while (await farmerRepository.findByFarmerId(candidate)) {
              seq += 1;
              candidate = `${prefix}${String(seq).padStart(3, '0')}`;
              if (seq > 9999) break;
            }
            const retry = await farmerRepository.create({ ...data, farmerId: candidate });
            return retry;
          } catch (retryErr) {
            // fall-through to error
          }
        }
        const msg = fields.length ? `Duplicate value for field(s): ${fields.join(', ')}` : 'Duplicate value encountered';
        throw new AppError(msg, StatusCodes.CONFLICT);
      }
      if (error?.name === 'SequelizeValidationError') {
        const details = error?.errors?.map(e => ({ message: e?.message, path: [e?.path] })) || [];
        const msg = error?.message || 'Validation failed';
        throw new AppError(msg, StatusCodes.BAD_REQUEST, details);
      }

      throw new AppError('Failed to register farmer', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getFarmerById(id) {
    try {
      const farmer = await farmerRepository.findById(id);
      if (!farmer) {
        throw new AppError('Farmer not found', StatusCodes.NOT_FOUND);
      }
      return farmer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch farmer details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getFarmerByFarmerId(farmerId) {
    try {
      const farmer = await farmerRepository.findByFarmerId(farmerId);
      if (!farmer) {
        throw new AppError('Farmer not found', StatusCodes.NOT_FOUND);
      }
      return farmer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch farmer details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllFarmers(filters = {}, pagination = {}) {
    try {
      const result = await farmerRepository.findAll(filters, pagination);
      return result;
    } catch (error) {
      throw new AppError('Failed to fetch farmers', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateFarmer(id, data) {
    try {
      const farmer = await farmerRepository.findById(id);
      if (!farmer) {
        throw new AppError('Farmer not found', StatusCodes.NOT_FOUND);
      }

      // Check for duplicate contact number if being updated
      if (data.contactNumber && data.contactNumber !== farmer.contactNumber) {
        const existingFarmer = await farmerRepository.findByContactNumber(data.contactNumber);
        if (existingFarmer) {
          throw new AppError('Farmer with this contact number already exists', StatusCodes.CONFLICT);
        }
      }

      // Check for duplicate Aadhar number if being updated
      if (data.aadharNumber && data.aadharNumber !== farmer.aadharNumber) {
        const existingFarmer = await farmerRepository.findByAadharNumber(data.aadharNumber);
        if (existingFarmer) {
          throw new AppError('Farmer with this Aadhar number already exists', StatusCodes.CONFLICT);
        }
      }

      const updatedFarmer = await farmerRepository.update(id, data);
      return updatedFarmer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update farmer', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFarmer(id) {
    try {
      const farmer = await farmerRepository.findById(id);
      if (!farmer) {
        throw new AppError('Farmer not found', StatusCodes.NOT_FOUND);
      }

      const deleted = await farmerRepository.delete(id);
      return deleted;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete farmer', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async loginFarmer(contactNumber, otp) {
    try {
      const farmer = await farmerRepository.findByContactNumber(contactNumber);
      if (!farmer) {
        throw new AppError('Farmer not found with this contact number', StatusCodes.NOT_FOUND);
      }

      if (!farmer.isActive) {
        throw new AppError('Farmer account is deactivated', StatusCodes.FORBIDDEN);
      }

      // Update last login
      await farmerRepository.updateLastLogin(farmer.id);

      return farmer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to login farmer', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // New login with DOB verification
  async loginFarmerWithDob(contactNumber, dateOfBirth) {
    try {
      const farmer = await farmerRepository.findByContactNumber(contactNumber);
      if (!farmer) {
        throw new AppError('Farmer not found with this contact number', StatusCodes.NOT_FOUND);
      }

      if (!farmer.isActive) {
        throw new AppError('Farmer account is deactivated', StatusCodes.FORBIDDEN);
      }

      // Normalize provided DOB to YYYY-MM-DD for comparison with DATEONLY
      let normalizedDob = dateOfBirth;
      try {
        const d = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
        normalizedDob = d.toISOString().slice(0, 10);
      } catch (_) {
        // If parsing fails, keep as is and let comparison fail
      }

      if (!farmer.dateOfBirth) {
        throw new AppError('Date of birth not set for this farmer', StatusCodes.BAD_REQUEST);
      }

      const storedDob = farmer.dateOfBirth instanceof Date
        ? farmer.dateOfBirth.toISOString().slice(0, 10)
        : String(farmer.dateOfBirth);

      if (storedDob !== normalizedDob) {
        throw new AppError('Invalid credentials. Date of birth does not match.', StatusCodes.UNAUTHORIZED);
      }

      // Update last login
      await farmerRepository.updateLastLogin(farmer.id);

      return farmer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to login farmer', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async sendOtp(contactNumber) {
    try {
      const farmer = await farmerRepository.findByContactNumber(contactNumber);
      if (!farmer) {
        throw new AppError('Farmer not found with this contact number', StatusCodes.NOT_FOUND);
      }

      if (!farmer.isActive) {
        throw new AppError('Farmer account is deactivated', StatusCodes.FORBIDDEN);
      }

      // In production, integrate with SMS service here
      // For now, we'll return a mock response
      const otp = '123456'; // This should be generated dynamically and sent via SMS
      
      return {
        message: 'OTP sent successfully',
        otp: otp, // Remove this in production
        contactNumber: contactNumber
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to send OTP', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getFarmerStats() {
    try {
      const stats = await farmerRepository.getStats();
      return stats;
    } catch (error) {
      throw new AppError('Failed to fetch farmer statistics', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new FarmerService();

const express = require('express');
const farmerController = require('../../controllers/farmer-controller');
const { authenticate } = require('../../middlewares/auth-middleware');
const { validateFarmerLogin, validateFarmerRegistration } = require('../../middlewares/farmer-middleware');

const router = express.Router();

// In development, bypass authentication to ease integration
const maybeAuth = (req, res, next) => {
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    return authenticate(req, res, next);
  }
  return next();
};

// Public routes
router.post('/register', validateFarmerRegistration, farmerController.registerFarmer);
router.post('/login', validateFarmerLogin, farmerController.loginFarmer);

// Protected routes (authentication required)
router.get('/stats', maybeAuth, farmerController.getFarmerStats);
router.get('/', maybeAuth, farmerController.getAllFarmers);
// Public lookup by external farmerId (needed for mobile create flow)
router.get('/farmer-id/:farmerId', farmerController.getFarmerByFarmerId);
router.get('/:id', maybeAuth, farmerController.getFarmerById);
router.put('/:id', maybeAuth, farmerController.updateFarmer);
router.delete('/:id', maybeAuth, farmerController.deleteFarmer);

module.exports = router;

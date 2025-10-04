const express = require('express');
const authController = require('../../controllers/auth-controller');
const { authenticate, authorize } = require('../../middlewares/auth-middleware');
const { validateCreateUser, validateUpdateUser } = require('../../middlewares/user-middleware');

const router = express.Router();

// Public routes
router.post('/login', authController.login);

// Protected routes - only for SUPER_ADMIN
router.post('/users', authenticate, authorize('SUPER_ADMIN'), validateCreateUser, authController.createUser);
router.get('/users', authenticate, authorize('SUPER_ADMIN'), authController.getAllUsers);
router.get('/users/:id', authenticate, authorize('SUPER_ADMIN'), authController.getUserById);
router.put('/users/:id', authenticate, authorize('SUPER_ADMIN'), validateUpdateUser, authController.updateUser);
router.delete('/users/:id', authenticate, authorize('SUPER_ADMIN'), authController.deleteUser);

module.exports = router;

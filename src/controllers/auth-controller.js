const authService = require('../services/auth-service');
const AppError = require('../utills/app-error');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const result = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await authService.createUser(userData);
    
    const { password, ...userWithoutPassword } = user.toJSON();
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await authService.getUserById(id);
    
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const user = await authService.updateUser(id, userData);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await authService.deleteUser(id);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

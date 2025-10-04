const userRepository = require('../repositories/user-repository');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utills/app-error');

class AuthService {
  async login(email, password) {
    // Find user by email
    const user = await userRepository.findUserByEmail(email);
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Validate password
    const isValidPassword = await userRepository.validatePassword(password, user.password);
    
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  async createUser(userData) {
    // Check if user already exists
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const existingUsername = await userRepository.findUserByUsername(userData.username);
    if (existingUsername) {
      throw new AppError('Username already taken', 400);
    }

    return await userRepository.createUser(userData);
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async getUserById(id) {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async updateUser(id, userData) {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await userRepository.updateUser(id, userData);
  }

  async deleteUser(id) {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await userRepository.deleteUser(id);
  }
}

module.exports = new AuthService();

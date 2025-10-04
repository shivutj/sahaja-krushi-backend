const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');

class UserRepository {
  async createUser(userData) {
    const { password, ...otherData } = userData;
    const hashedPassword = await hashPassword(password);
    
    return await User.create({
      ...otherData,
      password: hashedPassword
    });
  }

  async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findUserByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async findUserById(id) {
    return await User.findByPk(id);
  }

  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async updateUser(id, userData) {
    const { password, ...otherData } = userData;
    
    if (password) {
      otherData.password = await hashPassword(password);
    }
    
    return await User.update(otherData, { where: { id } });
  }

  async deleteUser(id) {
    return await User.destroy({ where: { id } });
  }

  async validatePassword(plainPassword, hashedPassword) {
    return await comparePassword(plainPassword, hashedPassword);
  }
}

module.exports = new UserRepository();

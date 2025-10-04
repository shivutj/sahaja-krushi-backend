const { StatusCodes } = require('http-status-codes');
const { NewsRepository } = require('../repositories');
const AppError = require('../utills/app-error');

const newsRepository = new NewsRepository();

const createNews = async (data) => {
  try {
    const news = await newsRepository.create(data);
    return news;
  } catch (error) {
    throw new AppError(
      'Failed to create news',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllNews = async () => {
  try {
    const newsList = await newsRepository.getAll();
    return newsList;
  } catch (error) {
    throw new AppError(
      'Failed to fetch news',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getNewsById = async (id) => {
  try {
    const news = await newsRepository.get(id);
    if (!news) {
      throw new AppError('News not found', StatusCodes.NOT_FOUND);
    }
    return news;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      'Failed to fetch news',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const updateNews = async (id, data) => {
  try {
    const updatedNews = await newsRepository.update(id, data);
    if (!updatedNews) {
      throw new AppError('News not found', StatusCodes.NOT_FOUND);
    }
    return updatedNews;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      'Failed to update news',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteNews = async (id) => {
  try {
    const deleted = await newsRepository.destroy(id);
    if (!deleted) {
      throw new AppError('News not found', StatusCodes.NOT_FOUND);
    }
    return deleted;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      'Failed to delete news',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};

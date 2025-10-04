const { StatusCodes } = require('http-status-codes');
const { NewsService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utills/common');

const createNews = async (req, res) => {
  try {
    const newsData = {
      title: req.body.title,
      content: req.body.content,
      documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
      documentName: req.file ? req.file.originalname : null
    };
    
    const news = await NewsService.createNews(newsData);
    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse('News created successfully', news));
  } catch (err) {
    return res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse(err.message));
  }
};

const getAllNews = async (req, res) => {
  try {
    const newsList = await NewsService.getAllNews();
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('News fetched successfully', newsList));
  } catch (err) {
    return res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse(err.message));
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await NewsService.getNewsById(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('News fetched successfully', news));
  } catch (err) {
    return res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse(err.message));
  }
};

const updateNews = async (req, res) => {
  try {
    const newsData = {
      title: req.body.title,
      content: req.body.content,
    };
    
    // Only update document if a new file is uploaded
    if (req.file) {
      newsData.documentUrl = `/uploads/${req.file.filename}`;
      newsData.documentName = req.file.originalname;
    }
    
    const updatedNews = await NewsService.updateNews(req.params.id, newsData);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('News updated successfully', updatedNews));
  } catch (err) {
    return res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse(err.message));
  }
};

const deleteNews = async (req, res) => {
  try {
    await NewsService.deleteNews(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse('News deleted successfully'));
  } catch (err) {
    return res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse(err.message));
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};

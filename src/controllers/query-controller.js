const { StatusCodes } = require('http-status-codes');
const successResponse = require('../utills/common/success-response');
const queryService = require('../services/query-service');
const { notifyAdminsNewQuery } = require('../services/notification-service');

class QueryController {
  async create(req, res) {
    try {
      const files = req.files || {};

      // Normalize files whether it's from upload.fields (object) or upload.any (array)
      let imagePath = null;
      let audioPath = null;
      let videoPath = null;
      if (Array.isArray(files)) {
        for (const f of files) {
          const mt = (f.mimetype || '').toLowerCase();
          if (!imagePath && (f.fieldname === 'image' || mt.startsWith('image/'))) imagePath = f.filename;
          else if (!audioPath && (f.fieldname === 'audio' || mt.startsWith('audio/'))) audioPath = f.filename;
          else if (!videoPath && (f.fieldname === 'video' || mt.startsWith('video/'))) videoPath = f.filename;
        }
      } else {
        imagePath = files.image?.[0]?.filename || null;
        audioPath = files.audio?.[0]?.filename || null;
        videoPath = files.video?.[0]?.filename || null;
      }

      // Require at least some content: description or one media file
      const hasAnyMedia = !!(imagePath || audioPath || videoPath);
      const hasDescription = typeof req.body.description === 'string' && req.body.description.trim().length > 0;
      if (!hasAnyMedia && !hasDescription) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Please provide a description or attach at least one media file (image, audio, or video).',
          data: null,
        });
      }

      const payload = {
        title: req.body.title || null,
        description: req.body.description || null,
        farmerIdString: req.body.farmerId || null, // FARMER-YYYY-NNN
        imagePath,
        audioPath,
        videoPath,
      };

      const created = await queryService.createQuery(payload);
      // Async notify admins (non-blocking)
      notifyAdminsNewQuery(created.id);

      // Include accessible URLs in the response (served by express at /uploads)
      const toJSON = typeof created.toJSON === 'function' ? created.toJSON() : created;
      const data = {
        ...toJSON,
        imageUrl: created.imagePath ? `/uploads/${created.imagePath}` : null,
        audioUrl: created.audioPath ? `/uploads/${created.audioPath}` : null,
        videoUrl: created.videoPath ? `/uploads/${created.videoPath}` : null,
      };

      return res.status(StatusCodes.CREATED).json(successResponse('Query submitted', data));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async listAll(req, res) {
    try {
      const { status } = req.query;
      const list = status ? await queryService.listAllWithStatus(status) : await queryService.listAll();
      return res.status(StatusCodes.OK).json(successResponse('Queries fetched', list));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }

  async listMine(req, res) {
    try {
      const { farmerId } = req.query; // FARMER-YYYY-NNN
      const list = await queryService.listByFarmerIdString(farmerId);
      return res.status(StatusCodes.OK).json(successResponse('Queries fetched', list));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const item = await queryService.getOne(Number(id));
      return res.status(StatusCodes.OK).json(successResponse('Query fetched', item));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }

  async answer(req, res) {
    try {
      const { id } = req.params;
      const { answer, status } = req.body;
      const updated = await queryService.answerQuery(Number(id), { answer, status });
      return res.status(StatusCodes.OK).json(successResponse('Query updated', updated));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }

  async escalate(req, res) {
    try {
      const { id } = req.params;
      const updated = await queryService.escalateQuery(Number(id));
      return res.status(StatusCodes.OK).json(successResponse('Query escalated', updated));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }

  async listAnswered(req, res) {
    try {
      const list = await queryService.listAnswered();
      return res.status(StatusCodes.OK).json(successResponse('Answered queries retrieved', list));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }

  async listEscalated(req, res) {
    try {
      const list = await queryService.listEscalated();
      return res.status(StatusCodes.OK).json(successResponse('Escalated queries retrieved', list));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }

  async adminContacts(req, res) {
    try {
      const list = await queryService.getAdminContacts();
      return res.status(StatusCodes.OK).json(successResponse('Admin contacts', list));
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
    }
  }
}

module.exports = new QueryController();

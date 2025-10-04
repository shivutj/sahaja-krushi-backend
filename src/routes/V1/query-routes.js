const express = require('express');
const queryController = require('../../controllers/query-controller');
const { upload } = require('../../middlewares/upload-middleware');

const router = express.Router();

// Submit a new query with optional media files
// Fields: description (text), title (optional), farmerId (FARMER-YYYY-NNN)
// Files (optional): image, audio, video
// Use explicit fields so multer maps to req.files.image / req.files.audio / req.files.video
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  queryController.create
);

// List all queries (admin)
router.get('/', queryController.listAll);

// List my queries by farmerId string
router.get('/mine', queryController.listMine);

// List all answered queries (for knowledge base)
router.get('/answered', queryController.listAnswered);

// List all escalated queries (super admin)
router.get('/escalated', queryController.listEscalated);

// List admin contacts (emails and phones)
router.get('/admin-contacts', queryController.adminContacts);

// Get one query by id
router.get('/:id', queryController.getOne);

// Answer/update a query (admin)
router.put('/:id/answer', queryController.answer);

// Escalate a query (farmer-initiated after threshold)
router.post('/:id/escalate', queryController.escalate);

module.exports = router;

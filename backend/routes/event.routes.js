const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// Protected routes
router.post('/', authMiddleware.protect, eventController.createEvent);
router.patch('/:id', authMiddleware.protect, eventController.updateEvent);
router.delete('/:id', authMiddleware.protect, eventController.deleteEvent);
router.post('/:id/join', authMiddleware.protect, eventController.joinEvent);

module.exports = router;

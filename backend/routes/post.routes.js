const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);

// Protected routes
router.post('/', authMiddleware.protect, postController.createPost);
router.patch('/:id', authMiddleware.protect, postController.updatePost);
router.delete('/:id', authMiddleware.protect, postController.deletePost);
router.post('/:id/comments', authMiddleware.protect, postController.addComment);
router.post('/:id/like', authMiddleware.protect, postController.likePost);

module.exports = router;

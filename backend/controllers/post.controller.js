const Post = require('../models/post.model');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username firstName lastName profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username firstName lastName profilePicture')
      .populate('comments.user', 'username firstName lastName profilePicture');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        post,
      },
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Create new post
exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the user is the author
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post',
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the user is the author
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.comments.unshift({
      user: req.user.id,
      text,
    });

    await post.save();

    // Populate the newly added comment's user details
    const updatedPost = await Post.findById(req.params.id)
      .populate('comments.user', 'username firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comments: updatedPost.comments,
      },
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Like post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the post has already been liked by the user
    if (post.likes.includes(req.user.id)) {
      // Unlike the post
      const index = post.likes.indexOf(req.user.id);
      post.likes.splice(index, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Post unliked',
        data: {
          likes: post.likes,
          count: post.likes.length,
        },
      });
    }

    // Like the post
    post.likes.push(req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post liked',
      data: {
        likes: post.likes,
        count: post.likes.length,
      },
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like/unlike post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

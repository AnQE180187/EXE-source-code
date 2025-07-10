const Event = require('../models/event.model');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'username firstName lastName profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: events.length,
      data: {
        events,
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get events',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username firstName lastName profilePicture')
      .populate('participants', 'username firstName lastName profilePicture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create({
      ...req.body,
      organizer: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        event: newEvent,
      },
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if the user is the organizer
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event',
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: {
        event: updatedEvent,
      },
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if the user is the organizer
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event',
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Join event
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is already a participant
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a participant of this event',
      });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined the event',
      data: {
        event,
      },
    });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

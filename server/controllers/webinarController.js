import { validationResult } from 'express-validator';
import Webinar from '../models/webinarModel.js';
import { resolveSpeakerId } from './resolveSpeakerId.js';

// @desc    Create a new webinar
// @route   POST /api/webinars
// @access  Private/Instructor
export const createWebinar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Use resolveSpeakerId to support username or ObjectId
    let speakerId = req.body.speaker || req.user._id;
    let resolvedSpeakerId = await resolveSpeakerId(speakerId);
    // If not found, but a custom name is provided, allow custom speaker
    if (!resolvedSpeakerId && req.body.speakerName) {
      req.body.speaker = null;
    } else if (!resolvedSpeakerId) {
      return res.status(400).json({ message: 'Speaker not found' });
    } else {
      req.body.speaker = resolvedSpeakerId;
    }
    const webinar = new Webinar({
      ...req.body,
    });

    const createdWebinar = await webinar.save();
    await createdWebinar.populate('speaker', 'name email profileImage');
    
    res.status(201).json(createdWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all webinars
// @route   GET /api/webinars
// @access  Public
export const getWebinars = async (req, res) => {
  try {
    const { status, search, speaker } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (speaker) filter.speaker = speaker;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const webinars = await Webinar.find(filter)
      .populate('speaker', 'name email profileImage')
      .sort({ startTime: 1 });

    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get webinar by ID
// @route   GET /api/webinars/:id
// @access  Public
export const getWebinarById = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id)
      .populate('speaker', 'name email profileImage role company experience bio expertise')
      .populate('attendees', 'name email');

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    res.json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update webinar
// @route   PUT /api/webinars/:id
// @access  Private/Instructor
export const updateWebinar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.speaker.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this webinar' });
    }

    // If speaker is being updated, resolve to ObjectId
    if (req.body.speaker) {
      const speakerId = await resolveSpeakerId(req.body.speaker);
      if (!speakerId) {
        return res.status(400).json({ message: 'Speaker not found' });
      }
      req.body.speaker = speakerId;
    }

    const updatedWebinar = await Webinar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('speaker', 'name email profileImage');

    res.json(updatedWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete webinar
// @route   DELETE /api/webinars/:id
// @access  Private/Instructor
export const deleteWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.speaker.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this webinar' });
    }

    await webinar.remove();
    res.json({ message: 'Webinar removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for webinar
// @route   PATCH /api/webinars/register/:id
// @access  Private
export const registerForWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.status === 'cancelled') {
      return res.status(400).json({ message: 'This webinar has been cancelled' });
    }

    if (webinar.startTime < new Date()) {
      return res.status(400).json({ message: 'This webinar has already started or ended' });
    }

    if (webinar.attendees.length >= webinar.maxAttendees) {
      return res.status(400).json({ message: 'Webinar has reached maximum capacity' });
    }

    if (webinar.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this webinar' });
    }

    webinar.attendees.push(req.user._id);
    await webinar.save();

    const populatedWebinar = await Webinar.findById(webinar._id)
      .populate('speaker', 'name email profileImage')
      .populate('attendees', 'name email');

    res.json(populatedWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update webinar status
// @route   PATCH /api/webinars/:id/status
// @access  Private/Instructor
export const updateWebinarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.speaker.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this webinar' });
    }

    webinar.status = status;
    await webinar.save();

    res.json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import { validationResult } from 'express-validator';
import Course from '../models/courseModel.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let thumbnailPath = '';
    if (req.file) {
      thumbnailPath = `/uploads/course-thumbnails/${req.file.filename}`;
    }
    const course = new Course({
      ...req.body,
      instructorId: req.user._id,
      thumbnail: thumbnailPath || req.body.thumbnail || '',
      lessons: req.body.lessons ? JSON.parse(req.body.lessons) : [],
      // Auto-approve and publish if admin
      approved: req.user.role === 'admin' ? true : false,
      published: req.user.role === 'admin' ? true : false,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
export const updateCourse = async (req, res) => {
  // Only validate fields that are present in req.body
  // Remove required validation for partial updates
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the course instructor or admin
    if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    // Only update fields that are present in req.body
    Object.keys(req.body).forEach((key) => {
      course[key] = req.body[key];
    });

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the course instructor or admin
    if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res) => {
  try {
    let { category, search, instructor, published = true } = req.query;
    const filter = {};

    // If published=all, do not filter by published/approved status (admin view)
    if (published !== 'all') {
      filter.published = published === 'true' || published === true;
      filter.approved = true;
    }
    if (category) filter.category = category;
    if (instructor) filter.instructorId = instructor;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructorId', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name email')
      .populate('reviews.user', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a course
// @route   PATCH /api/courses/:id/approve
// @access  Private/Admin
export const approveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.approved = !course.approved;
    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
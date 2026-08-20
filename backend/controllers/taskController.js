const mongoose = require('mongoose');
const Task = require('../models/Task');
const { cloudinary } = require('../config/cloudinary');
const { sendTaskCreationEmail, sendTaskCompletionEmail } = require('../utils/emailService');
const { getWeatherByCity } = require('../utils/weatherService');

// Upload buffer stream helper for memory fallback
const uploadBufferToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'task-attachments', resource_type: 'auto' },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper to extract file URL from req.file
const processUploadedFile = async (file) => {
  if (!file) return null;

  if (file.path || file.secure_url || file.url) {
    return file.path || file.secure_url || file.url;
  }

  if (file.buffer) {
    try {
      const cloudinaryUrl = await uploadBufferToCloudinary(file.buffer);
      return cloudinaryUrl;
    } catch (err) {
      console.error('Cloudinary Stream Upload Error:', err.message || err);
      const base64Data = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64Data}`;
    }
  }

  return null;
};

// Helper to parse dates safely
const parseSafeDate = (dateVal) => {
  if (!dateVal || typeof dateVal !== 'string') return undefined;
  const cleaned = dateVal.trim();
  if (!cleaned) return undefined;

  // Handle DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(cleaned)) {
    const [day, month, year] = cleaned.split('-');
    const parsed = new Date(`${year}-${month}-${day}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  const parsed = new Date(cleaned);
  return !isNaN(parsed.getTime()) ? parsed : undefined;
};

// @desc    Get logged-in user tasks with filtering & pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search, startDate, endDate } = req.query;

    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = parseSafeDate(startDate);
      if (endDate) query.dueDate.$lte = parseSafeDate(endDate);
    }

    const numericPage = Math.max(1, Number(page));
    const numericLimit = Math.max(1, Number(limit));
    const skip = (numericPage - 1) * numericLimit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Task.countDocuments(query),
    ]);

    const tasksWithWeather = await Promise.all(
      tasks.map(async (taskDoc) => {
        const taskObj = taskDoc.toObject();
        if (taskObj.location) {
          taskObj.weather = await getWeatherByCity(taskObj.location);
        }
        return taskObj;
      })
    );

    res.json({
      data: tasksWithWeather,
      meta: {
        total,
        page: numericPage,
        lastPage: Math.ceil(total / numericLimit) || 1,
      },
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Task not found - Invalid ID' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const taskObj = task.toObject();
    if (taskObj.location) {
      taskObj.weather = await getWeatherByCity(taskObj.location);
    }

    res.json(taskObj);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving task', error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, location } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const fileUrl = await processUploadedFile(req.file);

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate: parseSafeDate(dueDate),
      location,
      fileUrl,
    });

    // Await creation email notification
    await sendTaskCreationEmail(req.user.email, task);

    const taskObj = task.toObject();
    if (taskObj.location) {
      taskObj.weather = await getWeatherByCity(taskObj.location);
    }

    res.status(201).json(taskObj);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(400).json({ message: 'Failed to create task', error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Task not found - Invalid ID' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const previousStatus = task.status;
    const { title, description, status, priority, dueDate, location } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;

    const parsedDate = parseSafeDate(dueDate);
    if (parsedDate !== undefined) {
      task.dueDate = parsedDate;
    }

    if (location !== undefined) task.location = location;

    if (req.file) {
      const uploadedUrl = await processUploadedFile(req.file);
      if (uploadedUrl) {
        task.fileUrl = uploadedUrl;
      }
    }

    const updatedTask = await task.save();

    // Await task completion email if status transitions to DONE
    if (previousStatus !== 'DONE' && updatedTask.status === 'DONE') {
      console.log(`[Task Completion] Triggering completion email for task "${updatedTask.title}" to ${req.user.email}`);
      await sendTaskCompletionEmail(req.user.email, updatedTask);
    }

    const taskObj = updatedTask.toObject();
    if (taskObj.location) {
      taskObj.weather = await getWeatherByCity(taskObj.location);
    }

    res.json(taskObj);
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(400).json({ message: 'Failed to update task', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Task not found - Invalid ID' });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

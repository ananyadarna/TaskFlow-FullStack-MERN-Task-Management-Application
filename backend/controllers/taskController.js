const Task = require('../models/Task');
const { sendTaskCreationEmail, sendTaskCompletionEmail } = require('../utils/emailService');
const { getWeatherByCity } = require('../utils/weatherService');

// @desc    Get logged-in user tasks with filtering & pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search, startDate, endDate } = req.query;

    // Filter tasks strictly by logged-in user ID
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
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const numericPage = Math.max(1, Number(page));
    const numericLimit = Math.max(1, Number(limit));
    const skip = (numericPage - 1) * numericLimit;

    // Run task query and count in parallel
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Task.countDocuments(query),
    ]);

    // Attach live weather data if task has location
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
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
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

    // Extract file attachment URL if uploaded from Cloudinary / Multer
    let fileUrl = null;
    if (req.file) {
      fileUrl = req.file.path || req.file.secure_url || req.file.url || req.file.location;
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
      location,
      fileUrl,
    });

    // Dispatch background email notification
    sendTaskCreationEmail(req.user.email, task);

    const taskObj = task.toObject();
    if (taskObj.location) {
      taskObj.weather = await getWeatherByCity(taskObj.location);
    }

    res.status(201).json(taskObj);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
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
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (location !== undefined) task.location = location;

    if (req.file) {
      task.fileUrl = req.file.path || req.file.secure_url || req.file.url || req.file.location;
    }

    const updatedTask = await task.save();

    // Trigger task completion email if status updated to DONE
    if (previousStatus !== 'DONE' && updatedTask.status === 'DONE') {
      sendTaskCompletionEmail(req.user.email, updatedTask);
    }

    const taskObj = updatedTask.toObject();
    if (taskObj.location) {
      taskObj.weather = await getWeatherByCity(taskObj.location);
    }

    res.json(taskObj);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
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

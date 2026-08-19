const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingleFile } = require('../middleware/uploadMiddleware');

// Protect all task endpoints with JWT guard
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(uploadSingleFile('file'), createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(uploadSingleFile('file'), updateTask)
  .delete(deleteTask);

module.exports = router;

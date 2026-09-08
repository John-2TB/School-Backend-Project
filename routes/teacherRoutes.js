import express from 'express';
import {
  createTeacherController,
  getTeacherController,
  updateTeacherController,
  deleteTeacherController
} from '../controllers/teacherController.js';
import { authValidation, authorizeRoles, authorizeTeacherAccess, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';


const router = express.Router();

// ====================================
// POST
// ====================================
router.post('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), createTeacherController);

// ====================================
// GET
// ====================================
router.get('/:teacherId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), authorizeTeacherAccess(), getTeacherController);
router.get('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'),  getTeacherController);

// ====================================
// PATCH
// ====================================
router.patch('/:teacherId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), authorizeTeacherAccess(), updateTeacherController);

// ====================================
// DELETE
// ====================================
router.delete('/:teacherId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteTeacherController);

export default router;
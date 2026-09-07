import express from 'express';
import { createClassController, deleteClassController, getStudentByClassController } from '../controllers/classController.js';
import { authValidation, authorizeRoles, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /class
router.post('/', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin'), createClassController);

// GET students by /class
router.get('/:classId/students', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), getStudentByClassController);

// DELETE class by ID
router.delete('/:classId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteClassController)

export default router;
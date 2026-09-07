import express from 'express';
import { createSubjectController, deleteSubjectController, getStudentsBySubjectIdController } from "../controllers/subjectController.js";
import { authValidation, authorizeRoles, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';

const router = express.Router();

// ====================================
// POST
// ====================================
router.post('/', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin'), createSubjectController);

// ====================================
// GET
// ====================================
router.get('/:subjectId/students', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), getStudentsBySubjectIdController);


// ====================================
// DELETE
// ====================================
router.delete('/:subjectId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteSubjectController)

export default router;
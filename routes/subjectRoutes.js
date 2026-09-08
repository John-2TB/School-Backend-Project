import express from 'express';
import { createSubjectController, deleteSubjectController, getStudentsBySubjectIdController, getSubjectController } from "../controllers/subjectController.js";
import { authValidation, authorizeRoles, authorizeSubjectAccess, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';

const router = express.Router();

// ====================================
// POST
// ====================================
router.post('/', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin'), createSubjectController);

// ====================================
// GET
// ====================================
router.get('/:subjectId/students', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), getStudentsBySubjectIdController);

router.get('/:subjectId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher', 'student'), authorizeSubjectAccess(), getSubjectController);

router.get('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher', 'student'), getSubjectController);


// ====================================
// DELETE
// ====================================
router.delete('/:subjectId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteSubjectController)

export default router;
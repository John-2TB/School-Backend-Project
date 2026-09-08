import express from 'express';
import { createClassController, deleteClassController, getClassesController, getStudentByClassController, updateClassController } from '../controllers/classController.js';
import { authValidation, authorizeClassAccess, authorizeRoles, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';

const router = express.Router();


// ====================================
// POST
// ====================================

// POST /class
router.post('/', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin'), createClassController);


// ====================================
// GET
// ====================================

// GET students by /class
router.get('/:classId/students', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), authorizeClassAccess(),  getStudentByClassController);

router.get('/:classId', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), getClassesController);

router.get('/', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin'), getClassesController);


// ====================================
// PATCH
// ====================================
router.patch('/:classId', authValidation(),  ensurePasswordIsChanged(), authorizeRoles('admin'), updateClassController);


// ====================================
// DELETE
// ====================================

// DELETE class by ID
router.delete('/:classId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteClassController)

export default router;
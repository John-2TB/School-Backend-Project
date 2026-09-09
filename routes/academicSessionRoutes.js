import express from 'express';
import { createAcademicSessionController, deleteAcademicSessionController, getAcademicSessionController, updateAcademicSessionController } from '../controllers/academicSessionController.js';
import { authorizeRoles, authValidation, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';


const router = express.Router();


// ====================================
// POST
// ====================================
router.post('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), createAcademicSessionController);

// ====================================
// GET
// ====================================
router.get('/:sessionId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), getAcademicSessionController);
router.get('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), getAcademicSessionController);

// ====================================
// PATCH
// ====================================
router.patch('/:sessionId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), updateAcademicSessionController);


// ====================================
// DELETE
// ====================================
router.delete('/:sessionId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteAcademicSessionController);






export default router;
import express from 'express';
import { authorizeRoles, authValidation, ensurePasswordIsChanged, } from '../middleware/authMiddleware.js';
import { createResultController, deleteResultController, getResultController, getResultsByStudentController, updateResultController } from '../controllers/resultController.js';



const router = express.Router();

// ====================================
// POST
// ====================================
router.post('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), createResultController);

// ====================================
// GET
// ====================================
router.get(
  '/',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher', 'student'),
  getResultController
);


router.get(
  '/:resultId',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher', 'student'),
  getResultController
);



router.get(
  '/student/:studentId',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher', 'student'),
  getResultsByStudentController
);


// ====================================
// PATCH
// ====================================
router.patch(
  '/:resultId',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher'),
  updateResultController
);

// ====================================
// DELETE
// ====================================
router.delete(
  '/:resultId',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher'),
  deleteResultController
);

export default router;
import express from 'express';
import { authorizeRoles, authValidation, ensurePasswordIsChanged, authorizeResultSubjectAccess} from '../middleware/authMiddleware.js';
import { createResultController, deleteResultController, getResultController, getResultsByStudentRegistrationNumberController, updateResultController } from '../controllers/resultController.js';



const router = express.Router();

// ====================================
// POST
// ====================================
router.post('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), createResultController);

// ====================================
// GET
// ====================================


router.get(
  '/student/:registrationNumber',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher', 'student'),
  getResultsByStudentRegistrationNumberController
);


router.get(
  '/:resultId',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher', 'student'),
  getResultController
);

router.get(
  '/',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher', 'student'),
  getResultController
);


// ====================================
// PATCH
// ====================================
router.patch(
  '/:resultId',
  authValidation(),
  ensurePasswordIsChanged(),
  authorizeRoles('admin', 'teacher'),
  authorizeResultSubjectAccess(),
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
  authorizeResultSubjectAccess(),
  deleteResultController
);

export default router;
import express from 'express';
import { validatesStudent } from '../middleware/validation.js';
import { authValidation, authorizeRoles, authorizeStudentAccess, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';
import { 
  createStudentController, 
  deleteStudentController, 
  getStudentByRegistrationNumberController, 
  getStudentController, 
  updateStudentController
} from '../controllers/studentController.js';

const router = express.Router();


// ====================================
// GET
// ====================================
router.get('/:studentId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), authorizeStudentAccess(), getStudentController);

router.get('/registration/:registrationNumber', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), authorizeStudentAccess(), getStudentByRegistrationNumberController);

router.get('/', authValidation(),ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), getStudentController);




// ====================================
// POST
// ====================================

// Create a new student
router.post('/', validatesStudent({ requireAll: true }), authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), createStudentController);


// ====================================
// PATCH
// ====================================
router.patch('/:studentId', validatesStudent({requireAll: false}), authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin', 'teacher'), authorizeStudentAccess(), updateStudentController);


// ====================================
// DELETE
// ====================================
router.delete('/:studentId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteStudentController);

export default router;
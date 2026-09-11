import express from 'express';
import { activateStaffController, createStaffController, deactivateStaffController, deleteStaffController, getStaffController, updateStaffController } from '../controllers/staffController.js';
import { authorizeRoles, authValidation, ensurePasswordIsChanged } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';


const router = express.Router();

// Deactivates the staff
router.patch('/:staffId/deactivate', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deactivateStaffController);



// Activates the staff
router.patch('/:staffId/activate', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), activateStaffController);


// Create the staff
router.post('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), upload.single('profilePicture'), createStaffController);


// Get the staff
router.get('/:staffId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), getStaffController);

router.get('/', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), getStaffController);


// Update the staff
router.patch('/:staffId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), updateStaffController);



// Delete the staff
router.delete('/:staffId', authValidation(), ensurePasswordIsChanged(), authorizeRoles('admin'), deleteStaffController);





export default router;
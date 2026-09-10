import { asyncHandler } from "../utils/asyncHandler.js";
import { activateStaff, createStaff, deactivateStaff, deleteStaff, getStaff, updateStaff } from "../services/staffService.js";


export const deactivateStaffController = asyncHandler(
  async (req, res) => {
    const deactivatedStaff = await deactivateStaff(req.params.staffId);

    res.status(200).json({
      message: 'Staff successfully deactivated',
      data: deactivatedStaff
    });
  }
);



export const activateStaffController = asyncHandler(
  async (req, res) => {
    const activatedStaff = await activateStaff(req.params.staffId);

    res.status(200).json({
      message: 'Staff successfully activated',
      data: activatedStaff
    });
  }
);


export const createStaffController = asyncHandler(
  async (req, res) => {
    const createdStaff = await createStaff(req.body);

    res.status(201).json({
      message: 'Staff successfully created',
      data: createdStaff
    });
  }
);

export const getStaffController = asyncHandler(
  async (req, res) => {
    const staff = await getStaff(req.params.staffId);

    res.status(200).json({
      message: 'Staff found',
      data: staff
    });
  }
);

export const updateStaffController = asyncHandler(
  async (req, res) => {
    const updatedStaff = await updateStaff(req.params.staffId, req.body);

    res.status(200).json({
      message: 'Staff updated successfully',
      data: updatedStaff
    });
  }
);


export const deleteStaffController = asyncHandler(
  async (req, res) => {
    const deletedStaff = await deleteStaff(req.params.staffId);

    res.status(200).json({
      message: 'Staff successfully deleted',
      data: deletedStaff
    });
  }
);
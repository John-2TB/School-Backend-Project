import { Staff } from "../models/staffModel.js";
import { AppError } from "../errors/AppError.js";
import { Teacher } from "../models/teacherModel.js";
import mongoose from "mongoose";


// Deactivates the staff
export const deactivateStaff = async (staffId) => {
  if (
    staffId === undefined ||
    typeof staffId !== 'string' ||
    staffId.trim().length === 0 ||
    !mongoose.isValidObjectId(staffId)
  ) {
    throw new AppError('Invalid staff ID', 400)
  };

  const existingStaff = await Staff.findById(staffId);

  if (!existingStaff) {
    throw new AppError('Staff not found', 404);
  }

  if (existingStaff.isActive === false) {
    throw new AppError('Staff is already disabled', 400);
  };

  const updatedStaff = await Staff.findByIdAndUpdate(
    staffId,
    {isActive: false},
    {new: true}
  );

  return updatedStaff;
};



// Activates the staff
export const activateStaff = async (staffId) => {
  if (
    staffId === undefined ||
    typeof staffId !== 'string' ||
    staffId.trim().length === 0 ||
    !mongoose.isValidObjectId(staffId)
  ) {
    throw new AppError('Invalid staff ID', 400)
  };

  const existingStaff = await Staff.findById(staffId);

  if (!existingStaff) {
    throw new AppError('Staff not found', 404);
  }

  if (existingStaff.isActive === true) {
    throw new AppError('Staff is already enabled', 400);
  };

  const updatedStaff = await Staff.findByIdAndUpdate(
    staffId,
    {isActive: true},
    {new: true}
  );

  return updatedStaff;
};


export const createStaff = async (staffData) => {
  const {
    name,
    email,
    age,
    staffType,
    position,
    profilePicture
  } = staffData;

  if (
    name === undefined ||
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    email === undefined ||
    typeof email !== 'string' ||
    email.trim().length === 0 ||
    age === undefined ||
    typeof age !== 'number' ||
    Number.isNaN(age) ||
    staffType === undefined ||
    typeof staffType !== 'string' ||
    staffType.trim().length === 0 ||
    position === undefined ||
    typeof position !== 'string' ||
    position.trim().length === 0
  ) {
    throw new AppError('Invalid data', 400);
  }

  const validStaffType = ['teaching', 'non-teaching'];

  if (!validStaffType.includes(staffType)) {
    throw new AppError('Invalid data passed into staff type', 400);
  }

  const newStaff = await Staff.create({
    name,
    email,
    age,
    staffType,
    position,
    profilePicture
  });

  return newStaff;
};


export const getStaff = async (staffId) => {
  if (staffId === undefined) {
    const staff = await Staff.find();

    if (staff.length === 0) {
      throw new AppError('No staff found', 404);
    }

    return staff;
  }

  if (
    typeof staffId !== 'string' ||
    staffId.trim().length === 0 ||
    !mongoose.isValidObjectId(staffId)
  ) {
    throw new AppError('Invalid staff ID', 400);
  }

  const staff = await Staff.findById(staffId);

  if (!staff) {
    throw new AppError('Staff not found', 404);
  }

  return staff;
};



export const updateStaff = async (staffId, staffData) => {
  if (
    staffId === undefined ||
    typeof staffId !== 'string' ||
    staffId.trim().length === 0 ||
    !mongoose.isValidObjectId(staffId)
  ) {
    throw new AppError('Invalid staff ID', 400)
  };

  const {
    name,
    email,
    age,
    staffType,
    position
  } = staffData;

  if (
    (name !== undefined && typeof name !== 'string') ||
    (name !== undefined && name.trim().length === 0) ||
    (email !== undefined && typeof email !== 'string') ||
    (email !== undefined && email.trim().length === 0) ||
    (age !== undefined && typeof age !== 'number') ||
    (staffType !== undefined && typeof staffType !== 'string') ||
    (staffType !== undefined && staffType.trim().length === 0) ||
    (position !== undefined && typeof position !== 'string') ||
    (position !== undefined && position.trim().length === 0)
  ) {
    throw new AppError('Invalid data', 400);
  }

  if (staffType !== undefined) {
    const validStaffType = ['teaching', 'non-teaching'];

    if (!validStaffType.includes(staffType)) {
      throw new AppError('Invalid data passed into staff type', 400);
    };
  };

  const updateData = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(age !== undefined && { age }),
    ...(staffType !== undefined && { staffType }),
    ...(position !== undefined && { position })
  };

  if (Object.keys(updateData).length === 0) {
    throw new AppError('No valid fields provided for update', 400);
  };

  const updatedStaff = await Staff.findByIdAndUpdate(
    staffId,
    updateData,
    {new: true}
  );

  if (!updatedStaff) {
    throw new AppError('Staff not found', 404);
  }

  return updatedStaff

};



export const deleteStaff = async (staffId) => {
  if (
    staffId === undefined ||
    typeof staffId !== 'string' ||
    staffId.trim().length === 0 ||
    !mongoose.isValidObjectId(staffId)
  ) {
    throw new AppError('Invalid staff ID', 400)
  };

  const existingStaff = await Staff.findById(staffId);

  if (!existingStaff) {
    throw new AppError('Staff not found', 404);
  }

  const isTeacherRefrenced = await Teacher.findOne({
    staff: staffId
  });

  if (isTeacherRefrenced) {
    throw new AppError('Staff cannot be deleted because they are assigned to a teacher', 400);
  }

  const deletedStaff = await Staff.findByIdAndDelete(staffId);

  return deletedStaff;
};
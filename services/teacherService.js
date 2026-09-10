import { Teacher } from "../models/teacherModel.js";
import { Class } from "../models/classModel.js";
import { Subject } from "../models/subjectModel.js";
import { AppError } from "../errors/AppError.js";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Staff } from "../models/staffModel.js";


// Create Teacher
export const createTeacher = async (teacherData) => {
  const {
    staff,
    class: teacherClass,
    subjects
  } = teacherData;

  // Checks data type
  if (
    staff === undefined ||
    typeof staff !== 'string' ||
    staff.trim().length === 0 ||
    (teacherClass !== undefined && !mongoose.isValidObjectId(teacherClass)) ||
    (subjects !== undefined && !Array.isArray(subjects))
  ) {
    throw new AppError('Invalid data format', 400)
  }

  if (!mongoose.isValidObjectId(staff)) {
    throw new AppError('Invalid staff ID', 400);
  };

  const existingStaff = await Staff.findById(staff);

  if (!existingStaff) {
    throw new AppError('Staff not found', 404);
  }

  if (existingStaff.staffType !== 'teaching') {
    throw new AppError('Staff member is not teaching staff', 400);
  }

  if (teacherClass !== undefined) {
    // Check if the class exists
    const existingClass = await Class.findById(teacherClass);

    if (!existingClass) {
      throw new AppError('Class not found', 404);
    }
  };

  // Checks if subject IDs exist
  if (subjects && subjects.length > 0) {
    if (
      subjects.some(subject => (
        !mongoose.isValidObjectId(subject)
      ))
    ) {
      throw new AppError('Invalid subject ID', 400);
    }

    const existingSubjects = await Subject.find({
      _id: { $in: subjects }
    })

    if (existingSubjects.length !== subjects.length) {
      throw new AppError('One or more subjects not found', 404);
    }
  }

  // Checks duplicate subject ID
  if (subjects !== undefined) {
    const uniqueSubjects = new Set(subjects);

    if (uniqueSubjects.size !== subjects.length) {
      throw new AppError('Duplicate subjects are not allowed', 400);
    }
  }



  const newTeacher = await Teacher.create({
    staff,
    class: teacherClass,
    subjects
  });

  return newTeacher;
};



// Get Teacher
export const getTeacher = async (teacherId) => {

  if (teacherId === undefined) {
    return await Teacher.find().populate(['staff', 'class', 'subjects']);
  }

  if (
    typeof teacherId !== "string" ||
    teacherId.trim().length === 0 ||
    !mongoose.isValidObjectId(teacherId)
  ) {
    throw new AppError('Invalid teacher ID', 400)
  }

  const fetchedTeacher = await Teacher.findById(teacherId).populate(['staff', 'class', 'subjects']);

  if (!fetchedTeacher) {
    throw new AppError('Teacher not found', 404);
  }

  return fetchedTeacher;
};


// Patch Teacher
export const updateTeacher = async (teacherId, teacherData) => {

  const {
    class: teacherClass,
    subjects
  } = teacherData;

  if(
    (teacherClass !== undefined && typeof teacherClass !== 'string') ||
    (subjects !== undefined && !Array.isArray(subjects))
  ) {
    throw new AppError('Invalid teacher data', 400)
  };

  // Check if the class exists
  if (teacherClass !== undefined) {
    const existingClass = await Class.findById(teacherClass);

    if (!existingClass) {
      throw new AppError('Class not found', 404);
    }
  }


  // Checks if subject IDs exist
  if(subjects !== undefined && subjects.length > 0) {
    if (
      subjects.some(subject => (
        !mongoose.isValidObjectId(subject)
      ))
    ) {
      throw new AppError('Invalid subject ID', 400);
    }

    const existingSubjects = await Subject.find({
      _id: { $in: subjects }
    })

    if (existingSubjects.length !== subjects.length) {
      throw new AppError('One or more subjects not found', 404);
    }

  }

  // Ensures that subjects doesn't reset the subjects array to an empty array if not provided in the request body
  if (subjects !== undefined && subjects.length === 0) {
    throw new AppError('Subjects cannot be empty', 400);
  }
  

  const updateData = {
    ...(teacherClass !== undefined && { class: teacherClass }),
    ...(subjects !== undefined && { subjects })
  };

  // Check if updateData is empty
  if (Object.keys(updateData).length === 0) {
    throw new AppError('No valid fields provided for update', 400);
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    teacherId,
    updateData,
    {new: true}
  );

  if (!updatedTeacher) {
    throw new AppError('Teacher not found', 404);
  } 

  return updatedTeacher;
};


// DELETE Teacher
export const deleteTeacher = async (teacherId) => {

  // Checks if ID is valid
  if(!mongoose.isValidObjectId(teacherId)) {
    throw new AppError('Invalid teacher ID', 400)
  }

  // checks if ID is existing
  const existingTeacher = await Teacher.findById(teacherId).populate('staff');
  if (!existingTeacher) {
    throw new AppError('No teacher found', 404)
  }

  if (!existingTeacher.staff) {
    throw new AppError('Teacher is not assigned to a staff', 400);
  }

  if (existingTeacher.staff.isActive === true) {
    throw new AppError('Teacher cannot be deleted while their staff account is active', 400);
  }

  await User.findOneAndDelete({
    teacher: teacherId
  })

  const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

  return deletedTeacher;
};
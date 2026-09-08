import mongoose from 'mongoose';
import { Class } from '../models/classModel.js';
import { Student } from '../models/studentModel.js';
import { AppError } from '../errors/AppError.js';

// Creates new classes for student
export const createClass = async (className) => {
  const { name } = className;

  if (typeof name !== 'string' ||
    name.trim().length === 0
  ) {
    throw new AppError('Invalid data type', 400);
  }

  const newClass = await Class.create({
    name
  });

  return newClass;
};

// GET all classes
export const getClasses = async (classId) => {

  if (classId === undefined) {
    return await Class.find()
  }


  if (typeof classId !== 'string' ||
    classId.trim() === '' ||
    !mongoose.isValidObjectId(classId)
  ) {
    throw new AppError('Invalid data type', 400);
  }

  const classes = await Class.findById(classId);

  if (!classes) {
    throw new AppError('No class found', 404);
  }

  return classes;
}




// Get students by their class
export const getStudentByClass = async (classId) => {
  if (typeof classId !== 'string' ||
    classId.trim().length === 0 ||
    !mongoose.isValidObjectId(classId)
  ) {
    throw new AppError('Invalid data type', 400);
  }

  const students = await Student.find({ class: classId});

  if (students.length === 0) {
    throw new AppError('Student not found', 404);
  }

  return students;
};


// PATCH class by classId
export const updateClass = async (classId, classData) => {
  const {
    name
  } = classData;
  
  if (typeof classId !== 'string' ||
    classId.trim().length === 0 ||
    !mongoose.isValidObjectId(classId) ||
    typeof name !== 'string' ||
    name.trim().length === 0
  ) {
    throw new AppError('Invalid data type', 400);
  }

   const updateData = {
    ...(name !== undefined && { name })
   }
  
  const updatedClass = await Class.findByIdAndUpdate(
    classId,
    updateData,
    {new: true}
  );

  if (!updatedClass) {
    throw new AppError('Class not found', 404)
  }

  return updatedClass;

};





// DELETE class by class ID
export const deleteClass = async (classId) => {
  if (typeof classId !== 'string' ||
    classId.trim().length === 0 ||
    !mongoose.isValidObjectId(classId)
  ) {
    throw new AppError('Invalid data type', 400);
  }


    // Checks if class IDs exist
    const existingClass = await Class.findById(classId)
  
    if (!existingClass) {
      throw new AppError('Class not found', 404);
    }
  
  
    await Student.updateMany(
      { class: classId },
      { $set: { class: null } }
    );
  
    const deletedClass = await Class.findByIdAndDelete(classId);
  
    return deletedClass;
}
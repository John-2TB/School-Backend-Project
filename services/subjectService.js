import { Subject } from "../models/subjectModel.js";
import { Student } from "../models/studentModel.js";
import { AppError } from '../errors/AppError.js';
import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import { Teacher } from "../models/teacherModel.js";
import { Class } from "../models/classModel.js";

// Create a new subject
export const createSubject = async (subjectData) => {
  const { name, class: subjectClass } = subjectData

  if (name === undefined ) {
    throw new AppError('Subject name is required', 400);
  } 
  if (typeof name !== 'string') {
    throw new AppError('Subject name must be a string', 400);
  }
  if (name.trim().length === 0) {
    throw new AppError('Subject name cannot be empty', 400);
  }

  if (
    subjectClass === undefined ||
    typeof subjectClass !== 'string' ||
    subjectClass.trim().length === 0 ||
    !mongoose.isValidObjectId(subjectClass)
  ) {
    throw new AppError('Invalid class ID', 400);
  }

  if (
    !await Class.findById(subjectClass)
  ) {
    throw new AppError('Class not found', 404);
  }

  const newSubject = await Subject.create({
    name,
    class: subjectClass
  });

  return newSubject;
};



// Get students by subjectID
export const getstudentsBySubjectId = async (subjectId) => {
  if (
    typeof subjectId !== 'string' ||
    subjectId.trim().length === 0 ||
    !mongoose.isValidObjectId(subjectId)
  ) {
    throw new AppError('Invalid subject ID', 400)
  }

  const existingSubject = await Subject.findById(subjectId);

  if (!existingSubject) {
    throw new AppError('Subject not found', 404);
  };

  const students = await Student.find({ subjects: subjectId }).populate(['class', 'subjects']);

  if (students.length === 0) {
    throw new AppError('Student not found', 404)
  }

  return students;
}


// GET subjects
export const getSubjects = async (user, subjectId) => {
  
  if(subjectId === undefined) {

    // Admin and teacher can see all subjects
    if (user.role === 'admin' || user.role === 'teacher') {
      return await Subject.find().populate('class');
    }

    const existingUser = await User.findById(user.userId).populate('student');

    if (!existingUser) {
      throw new AppError('User not found', 404)
    }

    const existingStudent = existingUser.student;

    if (!existingStudent) {
      throw new AppError('User is not assigned to a student', 404);
    };

    return await Subject.find({
      _id: {$in: existingStudent.subjects}
    }).populate('class');
  }

  if (
    typeof subjectId !== 'string' ||
    subjectId.trim().length === 0 ||
    !mongoose.isValidObjectId(subjectId)
  ) {
    throw new AppError('Invalid subject ID', 400);
  };

  // If subjectId was provided
  const existingSubject =  await Subject.findById(subjectId).populate('class');

  if (!existingSubject) {
    throw new AppError('Subject not found', 404);
  }

  return existingSubject;
  
};


// Delete a subject by ID
export const deleteSubject = async (subjectId) => {
  if (
    typeof subjectId !== 'string' ||
    subjectId.length === 0 ||
    subjectId.trim().length === 0
  ) {
    throw new AppError('Invalid subject ID', 400)
  }

  if (!mongoose.isValidObjectId(subjectId)) {
    throw new AppError('Invalid subject ID', 400)
  }

  // Checks if subject IDs exist
  const existingSubject = await Subject.findById(subjectId)

  if (!existingSubject) {
    throw new AppError('Subjects not found', 404);
  }


  await Student.updateMany(
    { subjects: subjectId },
    { $pull: { subjects: subjectId } }
  );

  await Teacher.updateMany(
    { subjects: subjectId },
    { $pull: { subjects: subjectId } }
  )

  const deletedSubject = await Subject.findByIdAndDelete(subjectId);

  return deletedSubject;
};




export const updateSubject = async (subjectId, subjectData) => {

  if (!mongoose.isValidObjectId(subjectId)) {
    throw new AppError('Invalid subject ID', 400)
  }

  // Checks if subject IDs exist
  const existingSubject = await Subject.findById(subjectId)

  if (!existingSubject) {
    throw new AppError('Subject not found', 404);
  }

  const { name } = subjectData

  if (name === undefined) {
    throw new AppError('Subject name is required', 400);
  }
  if (typeof name !== 'string') {
    throw new AppError('Subject name must be a string', 400);
  }
  if (name.trim().length === 0) {
    throw new AppError('Subject name cannot be empty', 400);
  }

  const checkDuplicateDetails = await Subject.findOne({
    name: name,
    class: existingSubject.class,
    _id: { $ne: subjectId }
  });

  if (checkDuplicateDetails) {
    throw new AppError('A subject already exists with the same name and class', 409);
  };

  const updatedSubject = await Subject.findByIdAndUpdate(
    subjectId,
    {name},
    {returnDocument: 'after'}
  );

  return updatedSubject;
};
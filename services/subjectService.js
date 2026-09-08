import { Subject } from "../models/subjectModel.js";
import { Student } from "../models/studentModel.js";
import { AppError } from '../errors/AppError.js';
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

// Create a new subject
export const createSubject = async (subjectData) => {
  const { name } = subjectData

  if (name === undefined || 
    typeof name !== 'string' ||
    name.trim().length === 0) {
    throw new AppError('Invalid data', 400);
  }

  const newSubject = await Subject.create({
    name
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
      return await Subject.find();
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
    });
  }

  // If subjectId was provided
  const existingSubjects =  await Subject.findById(subjectId);

  if (!existingSubjects) {
    throw new AppError('Subject not found', 404);
  }

  return existingSubjects;
  
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

  const deletedSubject = await Subject.findByIdAndDelete(subjectId);

  return deletedSubject;
}
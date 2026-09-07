import { Student } from "../models/studentModel.js";
import { AppError } from '../errors/AppError.js';
import { Subject } from "../models/subjectModel.js";
import { Class } from "../models/classModel.js";
import { Teacher } from "../models/teacherModel.js";
import { User } from "../models/userModel.js";


// POST /student
export const createStudent = async (studentData) => {
  const { id, name, age, class: studentClass, subjects } = studentData;


  // Check if the class exists
  const existingClass = await Class.findById(studentClass);

  if (!existingClass) {
    throw new AppError('Class not found', 404);
  }


  // Checks if subject IDs exist
  if (subjects && subjects.length > 0) {
    const existingSubjects = await Subject.find({
      _id: { $in: subjects }
    })

    if (existingSubjects.length !== subjects.length) {
      throw new AppError('One or more subjects not found', 404);
    }
  }


  const newStudent = await Student.create({
    id,
    name,
    age,
    class: studentClass,
    subjects
  });

  console.log(newStudent);

  return newStudent;
};


// PATCH /student/:id
export const updateStudent = async (studentID, studentDetails) => {
  const studentId = Number(studentID);

  const { name, age, class: studentClass, subjects } = studentDetails;

  if(
    (name !== undefined && typeof name !== 'string') ||
    (age !== undefined && typeof age !== 'number') ||
    (studentClass !== undefined && typeof studentClass !== 'string') ||
    (subjects !== undefined && !Array.isArray(subjects))
  ) {
    throw new AppError('Invalid student data', 400)
  };

  // Check if the class exists
  if (studentClass !== undefined) {
    const existingClass = await Class.findById(studentClass);

    if (!existingClass) {
      throw new AppError('Class not found', 404);
    }
  }


  // Checks if subject IDs exist
  if(subjects !== undefined && subjects.length > 0) {

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
    ...(name !== undefined && { name }),
    ...(age !== undefined && { age }),
    ...(studentClass !== undefined && { class: studentClass }),
    ...(subjects !== undefined && { subjects })
  };

  // Check if updateData is empty
  if (Object.keys(updateData).length === 0) {
    throw new AppError('No valid fields provided for update', 400);
  }

  const updatedStudent = await Student.findOneAndUpdate(
    { id: studentId },
    updateData,
    {new: true}
  );

  if (!updatedStudent) {
    throw new AppError('Student not found', 404);
  } 

  return updatedStudent;
};


// GET /students
export const getStudent = async (id, user) => {

  const studentId = id;

  // ADMIN
  if (user.role === 'admin') {
    if (studentId === undefined) {
      return await Student.find().populate(['class', 'subjects']);
    }

    const filteredStudent = await Student.findOne({id: Number(studentId)}).populate(['class', 'subjects']);


    if (!filteredStudent) {
      throw new AppError('Student not found', 404);
    }

    return filteredStudent;
  }


  // TEACHER
  if (user.role === "teacher") {
    if (id !== undefined) {
      throw new AppError('Unauthorized access', 403);
    }

    const existingUser = await User.findById(user.userId).populate('teacher');

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const existingTeacher = existingUser.teacher

    if (!existingTeacher) {
      throw new AppError('Teacher not found', 404);
    }

    if (!existingTeacher) {
      throw new AppError('Teacher not found', 404);
    }

    const students = await Student.find({
      class: existingTeacher.class
    }).populate(['class', 'subjects']);

    if (students.length === 0) {
      throw new AppError('No student found', 404);
    };

    return students;
  }
};



// DELETE /student
export const deleteStudent = async (studentId) => {
  const id = Number(studentId);

  const deletedStudent = await Student.findOneAndDelete({id: id});
  
  if (!deletedStudent) {
    throw new AppError('Student not found', 404)
  };

  return deletedStudent;
};
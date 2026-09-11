import { Student } from "../models/studentModel.js";
import { AppError } from '../errors/AppError.js';
import { Subject } from "../models/subjectModel.js";
import { Class } from "../models/classModel.js";
import { Teacher } from "../models/teacherModel.js";
import { User } from "../models/userModel.js";
import { AcademicSession } from "../models/academicSessionModel.js";
import { StudentCounter } from "../models/studentCounterModel.js";
import mongoose, { mongo } from "mongoose";


// POST /student
export const createStudent = async (studentData) => {
  const {
    name,
    age,
    profilePicture,
    class: studentClass,
    subjects,
    academicSession
  } = studentData;

  if (
    academicSession === undefined ||
    typeof academicSession !== 'string' ||
    academicSession.trim().length === 0
  ) {
    throw new AppError('Invalid data passed into academic session', 400);
  };


  // Checks if academic session exist
  const existingSession = await AcademicSession.findById(academicSession);

  if (!existingSession) {
    throw new AppError('Academic session not found', 404);
  };

  // Check if the class exists
  const existingClass = await Class.findById(studentClass);

  if (!existingClass) {
    throw new AppError('Class not found', 404);
  }


  // Checks if subject IDs exist
  if (subjects && subjects.length > 0) {
    const isValidSubjectId = subjects.every(subject => mongoose.isValidObjectId(subject));

    if (!isValidSubjectId) {
      throw new AppError('Invalid subject ID', 400);
    }

    const existingSubjects = await Subject.find({
      _id: { $in: subjects }
    })

    if (existingSubjects.length !== subjects.length) {
      throw new AppError('One or more subjects not found', 404);
    }
  }

  // Generate the registration number

  const counter = await StudentCounter.findOneAndUpdate(
    {},
    { $inc: { sequence: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  const session = existingSession.session;

  const [startYear, endYear] = session.split('/');

  const sessionYear = `${startYear.slice(-2)}/${endYear.slice(-2)}`;

  const sequenceNumber = String(counter.sequence).padStart(3, '0');

  const registrationNumber = `MCS/${sessionYear}/${sequenceNumber}`;


  const newStudent = await Student.create({
    registrationNumber,
    name,
    age,
    profilePicture,
    class: studentClass,
    subjects,
    academicSession
  });

  return newStudent;
};


// PATCH /student/:id
export const updateStudent = async (studentID, studentDetails) => {

  const {
    name,
    age,
    class: studentClass,
    subjects,
    registrationNumber,
    academicSession
  } = studentDetails;

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

  if (
    registrationNumber !== undefined ||
    academicSession !== undefined
  ) {
    throw new AppError('Registration number and academic session cannot be edited', 400);
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

  const updatedStudent = await Student.findByIdAndUpdate(
    studentID,
    updateData,
    {returnDocument: 'after'}
  );

  if (!updatedStudent) {
    throw new AppError('Student not found', 404);
  } 

  return updatedStudent;
};


// GET /students
export const getStudent = async (studentId, user, queryAge, queryClass, querySubject) => {

  // ADMIN
  if (user.role === 'admin') {

    // For dynamically updating the filter
    const filter = {};

    // If a student ID wasn't inputed
    if (studentId === undefined) {

      // For querying the subjects of the students
      if (querySubject !== undefined) {
        if (
          querySubject.trim().length === 0 ||
          !mongoose.isValidObjectId(querySubject)
        ) {
          throw new AppError('Input a valid subject ID', 400);
        }

        filter.subjects = querySubject;
      };

      // For querying the class of the students
      if (queryClass !== undefined) {
        if (
          queryClass.trim().length === 0 ||
          !mongoose.isValidObjectId(queryClass)
        ) {
          throw new AppError('Input a valid class ID', 400);
        }

        filter.class = queryClass;
      };

      // For querying the age of the students
      if (queryAge !== undefined) {
        if (
          queryAge.trim().length === 0
        ) {
          throw new AppError('Input a valid age', 400);
        }

        if (Number.isNaN(Number(queryAge))) {
          throw new AppError('Age must be a valid number', 400);
        };

        filter.age = Number(queryAge)
      };

      const students = await Student.find(filter).populate(['class', 'subjects']);

      if (students.length === 0) {
        throw new AppError('No student found', 404);
      }

      return students;
    }

    // If the student ID was inputed
    const filteredStudent = await Student.findById(studentId).populate(['class', 'subjects']);


    if (!filteredStudent) {
      throw new AppError('Student not found', 404);
    }

    return filteredStudent;
  }


  // TEACHER
  if (user.role === "teacher") {
    const existingUser = await User.findById(user.userId).populate('teacher');

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const existingTeacher = existingUser.teacher

    if (!existingTeacher) {
      throw new AppError('Teacher not found', 404);
    }

    if (!existingTeacher.class) {
      throw new AppError('Unauthorized access', 403);
    };

    if (!existingTeacher.subjects) {
      throw new AppError('Unauthorized access', 403);
    };

    const filter = {
      class: existingTeacher.class
    }


    // Get students that is in the teacher's class
    if (studentId === undefined) {

      // For querying the subjects of the students
      if (querySubject !== undefined) {
        if (
          querySubject.trim().length === 0 ||
          !mongoose.isValidObjectId(querySubject)
        ) {
          throw new AppError('Input a valid subject ID', 400);
        }

        if (
          !existingTeacher.subjects.some(
            subject => subject.toString() === querySubject
          )
        ) {
          throw new AppError('Unauthorized access', 403);
        }

        filter.subjects = querySubject;
      };

      if (queryAge !== undefined) {
        if (
          queryAge.trim().length === 0
        ) {
          throw new AppError('Input a valid age', 400);
        }

        const queriedAge = Number(queryAge);

        if (Number.isNaN(queriedAge)) {
          throw new AppError('Age must be a valid number', 400);
        }

        filter.age = queriedAge;
      }

      const students = await Student.find(filter).populate(['class', 'subjects']);

      if (students.length === 0) {
        throw new AppError('No student found', 404);
      }

      return students;
    };


    if (queryAge !== undefined) {
      if (
        queryAge.trim().length === 0
      ) {
        throw new AppError('Input a valid age', 400);
      }

      const queriedAge = Number(queryAge);

      if (Number.isNaN(queriedAge)) {
        throw new AppError('Age must be a valid number', 400);
      }

      filter.age = queriedAge;

      const students = await Student.find(filter).populate(['class', 'subjects']);

      if (students.length === 0){
        throw new AppError('No student found', 404);
      }

      return students;
    };

    const students = await Student.find(filter).populate(['class', 'subjects']);

    if (students.length === 0) {
      throw new AppError('No student found', 404);
    };

    return students;
  }
};



// DELETE /student
export const deleteStudent = async (studentId) => {

  const existingStudent = await Student.findById(studentId);
  
  if (!existingStudent) {
    throw new AppError('Student not found', 404)
  };

  const existingUser = await User.findOne({
    student: studentId
  });

  // Delete the linked user account if one exists
  if (existingUser) {
    await User.findByIdAndDelete(existingUser._id)
  }

  const deletedStudent = await Student.findByIdAndDelete(studentId);

  return deletedStudent;
};



// Get students by registration number
export const getStudentByRegistrationNumber = async (registrationNumber) => {
  if (
    registrationNumber === undefined ||
    typeof registrationNumber !== 'string' ||
    registrationNumber.trim().length === 0
  ) {
    throw new AppError('Invalid registration number', 400);
  };

  const existingStudent = await Student.findOne({
    registrationNumber: registrationNumber
  });

  if (!existingStudent) {
    throw new AppError('No student found', 404);
  }

  return existingStudent;
};
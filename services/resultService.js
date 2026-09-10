import mongoose from "mongoose";
import { AppError } from "../errors/AppError.js";
import { Result } from "../models/resultModel.js";
import { Student } from "../models/studentModel.js";
import { Subject } from "../models/subjectModel.js";
import { AcademicSession } from "../models/academicSessionModel.js";
import { User } from "../models/userModel.js";



export const createResults = async (resultData) => {
  const {
    student,
    subject,
    academicSession,
    term,
    ca,
    exam
  } = resultData;

  if (!mongoose.isValidObjectId(student)){
    throw new AppError('Invalid student ID', 400)
  };

  if (!mongoose.isValidObjectId(subject)){
    throw new AppError('Invalid subject ID', 400)
  };

  if (!mongoose.isValidObjectId(academicSession)){
    throw new AppError('Invalid academic session ID', 400)
  };

  if (
    !await Student.findById(student)
  ) {
    throw new AppError('Student not found', 404);
  }

  if (
    !await Subject.findById(subject)
  ) {
    throw new AppError('Subject not found', 404);
  }

  if (
    !await AcademicSession.findById(academicSession)
  ) {
    throw new AppError('Academic session not found', 404);
  }

  const validTerm = ['First Term', 'Second Term', 'Third Term']

  if (
    term === undefined ||
    typeof term !== 'string' ||
    term.trim().length === 0 ||
    !validTerm.includes(term)
  ) {
    throw new AppError('Invalid data passed into term', 400);
  }

  if (
    (ca !== undefined && typeof ca !== 'number') ||
    (exam !== undefined && typeof exam !== 'number')
  ) {
    throw new AppError('Invalid data passed into CA or Exam', 400)
  }

  if (
    ca !== undefined && (ca < 0 || ca > 40)
  ) {
    throw new AppError('Exceeded the requirement for CA', 400);
  }
  
  if (
    exam !== undefined && (exam < 0 || exam > 60)
  ) {
    throw new AppError('Exceeded the requirement for Exam', 400);
  }

  // Checks if this result already exist 
  const existingResult = await Result.findOne({
    student: student,
    subject: subject,
    academicSession: academicSession,
    term: term
  });

  if (existingResult) {
    throw new AppError("A result already exists for this student, subject, academic session and term.", 409);
  }

  let total;

  if (
    ca !== undefined && exam !== undefined
  ) {
    total = ca + exam
  }

  let grade;

  if (total !== undefined) {
    if (total >= 80) {
      grade = 'A'
    } else if (total >= 70) {
      grade = 'B'
    } else if (total >= 60) {
      grade = 'C'
    } else if (total >= 50) {
      grade = 'D'
    } else if (total >= 40) {
      grade = 'E'
    } else if (total >= 0) {
      grade = 'F'
    }
  }

  const resultToCreate = {
    student,
    subject,
    academicSession,
    term,
    ...(ca !== undefined && { ca }),
    ...(exam !== undefined && { exam }),
    ...(total !== undefined && { total }),
    ...(grade !== undefined && { grade })
  };

  const newResult = await Result.create(resultToCreate);

  return newResult;
};


// Get the result
export const getResult = async (user, resultId) => {

  // if no result ID
  if (resultId === undefined) {
    
    // And the user is an admin, generate all the result
    if (user.role === 'admin') {
      const existingResult = await Result.find();

      if (existingResult.length === 0) {
        throw new AppError('No result found', 404);
      }

      return existingResult;
    }

    // If user is a teacher get only the result of the student in the calss the teacher is assigned to
    if (user.role === 'teacher') {
      const existingUser = await User.findById(user.userId).populate('teacher');

      if (!existingUser) {
        throw new AppError('User not found', 404);
      };

      const existingTeacher = existingUser.teacher;

      if (!existingTeacher) {
        throw new AppError('User is not assigned as a teacher', 404);
      };

      if (!existingTeacher.class) {
        throw new AppError('Teacher is not assigned to a class', 400);
      }

      // Find students assigned to the teacher class
      const studentsAssignedToTeacher = await Student.find({
        class: existingTeacher.class
      });

      if (studentsAssignedToTeacher.length === 0) {
        throw new AppError("No students found in the teacher's class", 404);
      }

      const studentIds = studentsAssignedToTeacher.map(student => student._id);

      const studentsResult = await Result.find({
        student: { $in: studentIds }
      }).populate(['student', 'subject', 'academicSession']);

      if (studentsResult.length === 0) {
        throw new AppError('Students result not found', 404);
      }

      return studentsResult;
    }


    // If user is a student, get only the student result
    if (user.role === 'student') {
      const existingUser = await User.findById(user.userId).populate('student');

      if (!existingUser) {
        throw new AppError('User not found', 404);
      };

      const existingStudent = existingUser.student;

      if (!existingStudent) {
        throw new AppError('User is not assigned as a student', 404);
      };

      const studentResult = await Result.find({
        student: existingStudent._id
      });

      if (studentResult.length === 0) {
        throw new AppError('Student result not found', 404);
      }

      return studentResult;
    }

  }

  if (
    typeof resultId !== 'string' ||
    resultId.trim().length === 0 ||
    !mongoose.isValidObjectId(resultId)
  ) {
    throw new AppError('Invalid result ID', 400);
  };


  // If result ID was provided
  if (user.role === 'admin') {
    const existingResult = await Result.findById(resultId);

    if (!existingResult) {
      throw new AppError('Result not found', 404);
    }

    return existingResult
  };

  // If the user is a teacher, check if the result queried for is a result of one of the student it is assigned to
  if (user.role === 'teacher') {

    const existingUser = await User.findById(user.userId).populate('teacher');

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const existingTeacher = existingUser.teacher;

    if (!existingTeacher) {
      throw new AppError('User is not assigned as a teacher', 404);
    };

    if (!existingTeacher.class) {
      throw new AppError('Teacher is not assigned to a class', 400);
    }

    const existingResult = await Result.findById(resultId).populate(['student', 'subject', 'academicSession']);

    if (!existingResult) {
      throw new AppError('Result not found', 404);
    }

    const existingStudent = existingResult.student;

    if (!existingStudent) {
      throw new AppError('Result is not assigned to a student', 404);
    };

    if (!existingStudent.class) {
      throw new AppError('Student is not assigned to a class', 404);
    };

    if (
      !existingTeacher.class.equals(existingStudent.class)
    ) {
      throw new AppError('Unauthorized access', 403);
    };

    return existingResult;

  }

  // If user is a student, check if the result is for the student
  if (user.role === 'student') {
    const existingUser = await User.findById(user.userId).populate('student');

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const existingStudent = existingUser.student;

    if (!existingStudent) {
      throw new AppError('User is not assigned as a student', 404);
    };

    const studentResult = await Result.findById(resultId);

    if (!studentResult) {
      throw new AppError('Result not found', 404);
    }

    if (!studentResult.student) {
      throw new AppError('Result is not assigned to a student', 404);
    }

    if (
      !studentResult.student.equals(existingStudent._id)
    ) {
      throw new AppError('Unauthorized access', 403);
    }

    return studentResult;
  }

};



// Allowed to update only the CA and Exam
export const updateResult = async (resultId, resultData) => {
  const {
    ca,
    exam
  } = resultData;

  if (ca === undefined && exam === undefined) {
    throw new AppError('CA or Exam must be provided', 400);
  };

  if (!mongoose.isValidObjectId(resultId)) {
    throw new AppError('Invalid result ID', 400);
  }

  const existingResult = await Result.findById(resultId);

  if (!existingResult) {
    throw new AppError('Result not found', 404);
  };

  if (
    (ca !== undefined && typeof ca !== 'number') ||
    (exam !== undefined && typeof exam !== 'number')
  ) {
    throw new AppError('Invalid data passed into CA or Exam', 400)
  }

  if (
    ca !== undefined && (ca < 0 || ca > 40)
  ) {
    throw new AppError('Exceeded the requirement for CA', 400);
  }
  
  if (
    exam !== undefined && (exam < 0 || exam > 60)
  ) {
    throw new AppError('Exceeded the requirement for Exam', 400);
  }


  const finalCA = ca !== undefined
  ? ca
  : existingResult.ca;

  const finalExam = exam !== undefined
  ? exam
  : existingResult.exam;

  let total;
  let grade;

  if (finalCA !== undefined && finalExam !== undefined) {
    total = finalCA + finalExam;

    if (total >= 80) {
      grade = 'A';
    } else if (total >= 70) {
      grade = 'B';
    } else if (total >= 60) {
      grade = 'C';
    } else if (total >= 50) {
      grade = 'D';
    } else if (total >= 40) {
      grade = 'E';
    } else {
      grade = 'F';
    }
  }

  const updateData = {
    ...(ca !== undefined && { ca }),
    ...(exam !== undefined && { exam }),
    ...(total !== undefined && { total }),
    ...(grade !== undefined && { grade })
  };

  const updatedResult = await Result.findByIdAndUpdate(
    resultId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedResult) {
    throw new AppError('Result not found', 404);
  }

  return updatedResult;

};



export const deleteResult = async (resultId) => {

  if (
    resultId === undefined ||
    typeof resultId !== 'string' ||
    resultId.trim().length === 0 ||
    !mongoose.isValidObjectId(resultId)
  ) {
    throw new AppError('Invalid result ID', 400);
  }


  const existingResult = await Result.findById(resultId);

  if (!existingResult) {
    throw new AppError('Result not found', 404);
  }

  const deletedResult = await Result.findByIdAndDelete(resultId);

  return deletedResult;


};



// GETs result through student registration number
export const getResultsByStudentRegistrationNumber = async (user, registrationNumber) => {
  if (
    registrationNumber === undefined ||
    typeof registrationNumber !== 'string' ||
    registrationNumber.trim().length === 0
  ) {
    throw new AppError('Invalid registration number', 400);
  }

  const existingStudent = await Student.findOne({
    registrationNumber: registrationNumber
  });

  if (!existingStudent) {
    throw new AppError('Student not found', 404);
  }

  // And the user is an admin, generate all the result
  if (user.role === 'admin') {
    const existingResult = await Result.find({
      student: existingStudent._id
    }).populate(['student', 'subject', 'academicSession']);

    if (existingResult.length === 0) {
      throw new AppError('No result found', 404);
    }

    return existingResult;
  }

  // If user is a teacher get only the result of the student in the calss the teacher is assigned to
  if (user.role === 'teacher') {
    const existingUser = await User.findById(user.userId).populate('teacher');

    if (!existingUser) {
      throw new AppError('User not found', 404);
    };

    const existingTeacher = existingUser.teacher;

    if (!existingTeacher) {
      throw new AppError('User is not assigned as a teacher', 404);
    };

    if (!existingTeacher.class) {
      throw new AppError('Teacher is not assigned to a class', 400);
    }

    // Find students assigned to the teacher class
    if (!existingStudent.class) {
      throw new AppError('Student is not assigned to a class', 404);
    };

    if (
      !existingStudent.class.equals(existingTeacher.class)
    ) {
      throw new AppError('Unauthorized access', 403);
    }

    const studentResults = await Result.find({
      student: existingStudent._id
    }).populate(['student', 'subject', 'academicSession']);

    if (studentResults.length === 0) {
      throw new AppError('Student result not found', 404);
    }

    return studentResults;
  }


  // If user is a student, get only the student result
  if (user.role === 'student') {
    const existingUser = await User.findById(user.userId).populate('student');

    if (!existingUser) {
      throw new AppError('User not found', 404);
    };

    if (!existingUser.student) {
      throw new AppError('User is not assigned as a student', 404);
    };

    if (
      !existingUser.student._id.equals(existingStudent._id)
    ) {
      throw new AppError('Unauthorized access', 403);
    };

    const studentResults = await Result.find({
      student: existingStudent._id
    }).populate(['student', 'subject', 'academicSession']);

    if (studentResults.length === 0) {
      throw new AppError('Student result not found', 404);
    }

    return studentResults;
  }

};
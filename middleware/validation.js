import mongoose from "mongoose";
import { Class } from "../models/classModel.js";
import { Subject } from "../models/subjectModel.js";

export const validatesStudent = (options) => {
  return (req, res, next) => {
  const { name, age, class: studentClass, subjects } = req.body;

  // ============================ 
  // POST validation 
  // ============================

  if(options.requireAll){
    // Checks if all required filed exist
    if (
      name === undefined ||
      age === undefined ||
      studentClass === undefined ||
      subjects === undefined
    ) {
      return res.status(400).json({
        message: 'Name, age, class and subjects are required'
      });
    }



    
    // Checks type of data that was given
    if (
      typeof name !== 'string' ||
      typeof age !== 'number' ||
      typeof studentClass !== 'string' ||
      !Array.isArray(subjects)
    ) {
      return res.status(400).json({
        message: 'Invalid student data'
      })
    }

    // Checks if class is a valid ObjectId
    if (!mongoose.isValidObjectId(studentClass)) {
      return res.status(400).json({
        message: 'Invalid student class data'
      });
    }

    // Checks if subjects array contains only strings
    if (
      subjects.some(subject => 
        (typeof subject !== 'string') || (!mongoose.isValidObjectId(subject))
      )
    ) {

      return res.status(400).json({
        message: 'Invalid student subjects data'
     });
    }

    const uniqueSubjects = new Set(subjects);

    if (uniqueSubjects.size !== subjects.length) {
      return res.status(400).json({
        message: 'Duplicate subjects are not allowed'
      })
    }

    // Checks value
    if (
      name.trim().length === 0 ||
      age <= 0 ||
      studentClass.trim().length === 0
    ) {
      return res.status(400).json({
        message: 'Invalid student data'
      })
    }

  }

  // ===============================
  // PATCH validation
  // ===============================
  else {

    // only validates fields that were actually provided
    if (
      (name !== undefined && typeof name !== 'string') ||
      (age !== undefined && typeof age !== 'number') ||
      (studentClass !== undefined && typeof studentClass !== 'string') ||
      (subjects !== undefined && !Array.isArray(subjects))
    ) {
      return res.status(400).json({
        message: 'Invalid student data'
      })
    }

    // Checks the value
    if (
      (name !== undefined && name.trim().length === 0) ||
      (age !== undefined && age <= 0) ||
      (studentClass !== undefined && studentClass.trim().length === 0)
    ) {
      return res.status(400).json({
        message: 'Invalid student data'
      })
    }

    // Checks if class is a valid ObjectId
    if (studentClass !== undefined && !mongoose.isValidObjectId(studentClass)) {
      return res.status(400).json({
        message: 'Invalid student class data'
      });
    }

    if (subjects !== undefined &&
      subjects.some(subject => 
        typeof subject !== 'string' ||
        !mongoose.isValidObjectId(subject)
      )
    ) {
      return res.status(400).json({
        message: 'Invalid student subject data'
      });
    }

    if (subjects !== undefined) {
      const uniqueSubjects = new Set(subjects);

      if (uniqueSubjects.size !== subjects.length) {
        return res.status(400).json({
          message: 'Duplicate subjects are not allowed'
        })
      }
    }
  }

  next();
}};


// Validate user
export const validateUser = () => {
  return (req, res, next) => {


    const {
      registrationNumber,
      email,
      password,
      role,
      student,
      teacher
    } = req.body;


    const validRoles = ['student', 'teacher', 'admin'];

    if(!validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role'
        })
    }

    // Password is required
    if(!password) {
      return res.status(400).json({
        message: 'Password is required'
      })
    }

    // Checks type of data passed in
    if (
      (registrationNumber !== undefined && typeof registrationNumber !== 'string') ||
      (typeof password !== 'string') ||
      (email !== undefined && typeof email !== 'string') ||
      (student !== undefined && !mongoose.isValidObjectId(student)) ||
      (teacher !== undefined && !mongoose.isValidObjectId(teacher))
    ) {
      return res.status(400).json({
        message: 'Invalid data type parsed in'
      })
    }


    // STUDENT Rules
    if (role === 'student') {
      // Registration Number is required
      if(!registrationNumber) {
        return res.status(400).json({
          message: 'Student requires a registration number'
        })
      }

      // Student refrence is required
      if(!student) {
        return res.status(400).json({
          message: 'Student requires a refrence ID'
        })
      }

      if(teacher !== undefined) {
        return res.status(400).json({
          message: 'Student must not have a teacher refrence ID'
        })
      }
    }


    // TEACHERS
    if (role === 'teacher') {
      // Registration Number is not required
      if(registrationNumber !== undefined) {
        return res.status(400).json({
          message: 'Teacher must not have a registration number'
        })
      }

      if (!email) {
        return res.status(400).json({
          message: 'Teacher must have an email'
        })
      }

      // Student refrence is not required
      if(student !== undefined) {
        return res.status(400).json({
          message: 'Teacher must not have a student refrence ID'
        })
      }

      if(!teacher) {
        return res.status(400).json({
          message: 'Teacher must have a teacher refrence ID'
        })
      }
    }

    // ADMIN Rules
    if (role === 'admin') {
      // Registration Number is not required
      if(registrationNumber !== undefined) {
        return res.status(400).json({
          message: 'Admin must not have a registration number'
        })
      }

      if (!email) {
        return res.status(400).json({
          message: 'Admin must have an email'
        })
      }

      // Student refrence is not required
      if(student !== undefined) {
        return res.status(400).json({
          message: 'Admin must not have a student refrence ID'
        })
      }

      if(teacher !== undefined) {
        return res.status(400).json({
          message: 'Admin must not have a teacher refrence ID'
        })
      }
    }


    next();    
  }
};


export const normalizeStudentData = () => {
  return (req, res, next) => {
  // Convert age from string to number
  if (req.body.age !== undefined) {
    req.body.age = Number(req.body.age);
  }

  // Convert subjects from JSON string to array
  if (req.body.subjects !== undefined) {
    try {
      req.body.subjects = JSON.parse(req.body.subjects);
    } catch {
      return res.status(400).json({
        message: 'Subjects must be a valid JSON array'
      });
    }
  }

  next();
}
};
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Teacher } from '../models/teacherModel.js';
import { Student } from '../models/studentModel.js';
import { Result } from '../models/resultModel.js';


export const authValidation = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication token required"
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Authentication token required'
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = decoded;

      next();

    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }

  }
};


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action'
      });
    };

    next();
  }
};


export const ensurePasswordIsChanged = () => {
  return asyncHandler (
    async (req, res, next) => {
      const existingUser = await User.findById(req.user.userId);

      if (!existingUser) {
        return res.status(404).json({
          message: 'User not found'
        });
      };

      if (existingUser.mustChangePassword) {
        return res.status(403).json({
          message: 'You must change password'
        });
      };
      
      next();
    }
  );
};


export const authorizeStudentAccess = () => {
  return asyncHandler(
    async (req, res, next) => {
      // Checks if the user is an admin so it skips the student access which is meant for the teachers
      if (req.user.role === 'admin') {
       return next();
      }

      const existingUser = await User.findById(req.user.userId).populate('teacher');

      if (!existingUser) {
        return res.status(404).json({
          message: "User not found"
        });
      };

      if (!existingUser.teacher) {
        return res.status(404).json({
          message: "User is not assigned as a teacher"
        });
      }

      const existingTeacher = existingUser.teacher;

      const requestedStudent = await Student.findById(req.params.studentId);

      if (!requestedStudent) {
        return res.status(404).json({
          message: "Student not found"
        });
      };

      if (!existingTeacher.class) {
        return res.status(403).json({
          message: 'Unauthorized access'
        })
      };

      if (!existingTeacher.class.equals(requestedStudent.class)) {
        return res.status(403).json({
          message: "You are not assigned to this class"
        });
      };

      next();
    }
  );
};


export const authorizeTeacherAccess = () => {
  return asyncHandler(
    async (req, res, next) => {
      
      // To allow admin
      if (req.user.role === 'admin') {

        return next();
      }

      const existingUser = await User.findById(req.user.userId).populate('teacher');

      if (!existingUser) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      const existingTeacher = existingUser.teacher;

      if (!existingTeacher) {
        return res.status(404).json({
          message: "User is not assigned as a teacher"
        })
      }

      if (!existingTeacher._id.equals(req.params.teacherId)) {
        return res.status(403).json({
          message: 'Unauthorized access'
        });
      }

      next();
    }
  );
};



export const authorizeClassAccess = () => {
  return asyncHandler(
    async (req, res, next) => {

      // To allow admin
      if (req.user.role === 'admin') {

        return next();
      }

      const existingUser = await User.findById(req.user.userId).populate('teacher');

      if (!existingUser) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      const existingTeacher = existingUser.teacher;

      if (!existingTeacher) {
        return res.status(404).json({
          message: "User is not assigned as a teacher"
        });
      }

      if (!existingTeacher.class) {
        return res.status(404).json({
          message: "Teacher is not assigned to a class"
        });
      }

      if(!existingTeacher.class.equals(req.params.classId)) {
        return res.status(403).json({
          message: 'Unauthorized access'
        });
      }

      next();

    }
  );
};



export const authorizeSubjectAccess = () => {
  return asyncHandler(
    async (req, res, next) => {

      if (req.user.role === 'admin' || req.user.role === 'teacher') {
        return next();
      }

      const existingUser = await User.findById(req.user.userId).populate('student');

      if (!existingUser) {
        return res.status(404).json({
          message: 'User not found'
        });
      };

      const existingStudent = existingUser.student;

      if (!existingStudent) {
        return res.status(404).json({
          message: "User is not assigned to a student"
        });
      };

      const hasAccess = existingStudent.subjects.some(
        subject => subject.equals(req.params.subjectId)
      );

      if (!hasAccess) {
        return res.status(403).json({
          message: "Unauthorized access"
        });
      }

      return next();

    }
  );
};



export const authorizeResultSubjectAccess = () => {
  return asyncHandler(
    async (req, res, next) => {

      if (req.user.role === 'admin') {
        return next();
      }


      const existingUser = await User.findById(req.user.userId).populate('teacher');
  
      if (!existingUser) {
        throw new AppError('User not found', 404);
      };
  
      const existingTeacher = existingUser.teacher;
  
      if (!existingTeacher) {
        throw new AppError('User is not assigned as a teacher', 404);
      };
  
      if (existingTeacher.subjects.length === 0) {
        throw new AppError('Teacher is not assigned to a subject', 400);
      }
  
      const existingResult = await Result.findById(req.params.resultId);
  
      if (!existingResult) {
        throw new AppError('Result not found', 404);
      }
  
      const hasAccess = existingTeacher.subjects.some(
        subject => subject.equals(existingResult.subject)
      );
  
      if (!hasAccess) {
        throw new AppError('Unauthorized Access', 403);
      }

      next();

    }
  );
};
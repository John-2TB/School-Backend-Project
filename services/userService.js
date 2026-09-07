import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";
import { Teacher } from '../models/teacherModel.js';
import { AppError } from "../errors/AppError.js";
import { Student } from "../models/studentModel.js";



// Create user
export const createUser = async (userData) => {
  const {
    registrationNumber,
    email,
    password,
    role,
    student,
    teacher
  } = userData;

  // Checks if the student ID is existing
  if (role === 'student') {
    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      throw new AppError('Student not found', 404);
    }
  }

  if (role === 'teacher') {
    const existingTeacher = await Teacher.findById(teacher);

    if (!existingTeacher) {
      throw new AppError('Teacher not found', 404);
    }
  }

  const mustChangePassword = role === 'student' || role === 'teacher';

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    registrationNumber,
    email,
    password: hashedPassword,
    role,
    student,
    teacher,
    mustChangePassword
  });

  return {
    registrationNumber,
    email,
    role,
    student,
    teacher,
    mustChangePassword
  };

};


// LOGIN user
export const loginUser = async (loginData) => {
  const {
    registrationNumber,
    email,
    password,
    role
  } = loginData;

  if (
    (role === 'teacher' || role === 'admin') &&
    registrationNumber !== undefined
  ) {
    throw new AppError('Invalid credentials', 400);
  }

  const validRole = ['student', 'teacher', 'admin']

  if (!validRole.includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  // For student user
  if (role === 'student') {
    const existingUser = await User.findOne({
      registrationNumber: registrationNumber,
      role: role
    });

    if (!existingUser) {
      throw new AppError('No user found', 404);
    }

    const correctPassword = await bcrypt.compare(password, existingUser.password);

    if (!correctPassword) {
      throw new AppError('Incorrect password', 400)
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role,
        mustChangePassword: existingUser.mustChangePassword
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    return {
      registrationNumber,
      role,
      mustChangePassword: existingUser.mustChangePassword,
      token
    };
  }

  // For teacher and admin user
  if (role === 'teacher' || role === 'admin') {
    const existingUser = await User.findOne({
      email: email,
      role: role
    });

    if (!existingUser) {
      throw new AppError('No user found', 404);
    }

    const correctPassword = await bcrypt.compare(password, existingUser.password);

    if (!correctPassword) {
      throw new AppError('Incorrect password', 400)
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role,
        mustChangePassword: existingUser.mustChangePassword
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    return {
      email,
      role,
      mustChangePassword: existingUser.mustChangePassword,
      token
    };
  }

};



export const changePassword = async (userId, passwordData) => {
  const {
    currentPassword,
    newPassword
  } = passwordData

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError('User not found', 404)
  };

  if(!existingUser.mustChangePassword) {
    throw new AppError('Password has already been changed', 403)
  }

  if (
    typeof currentPassword !== 'string' ||
    currentPassword.trim().length === 0 ||
    typeof newPassword !== 'string' ||
    newPassword.trim().length === 0
  ) {
    throw new AppError('Invalid data type', 400);
  }

  const correctPassword = await bcrypt.compare(currentPassword, existingUser.password);

  if (!correctPassword) {
    throw new AppError('Incorrect password', 400);
  }

  if (newPassword.trim() === currentPassword.trim()) {
    throw new AppError('Create a new password', 400);
  }

  if (newPassword.trim().length < 8) {
    throw new AppError('Password is too short', 400);
  }

  const password = await bcrypt.hash(newPassword, 10);

  existingUser.password = password;
  existingUser.mustChangePassword = false;

  await existingUser.save();

  return {
    message: 'Password changed successfully'
  };
  
}
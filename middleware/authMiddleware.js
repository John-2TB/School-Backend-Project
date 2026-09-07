import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';


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
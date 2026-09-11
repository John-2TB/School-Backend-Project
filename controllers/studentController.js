import { createStudent, deleteStudent, getStudent, getStudentByRegistrationNumber, updateStudent } from '../services/studentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /student
export const getStudentController = asyncHandler(
  async (req, res) => {
    const student = await getStudent(req.params.studentId, req.user);

    res.status(200).json({
      message: 'Students found',
      data: student
    });
  }
);

// GET student by registration number
export const getStudentByRegistrationNumberController = asyncHandler(
  async (req, res) => {
    const student = await getStudentByRegistrationNumber(req.params.registrationNumber);

    res.status(200).json({
      message: 'Students found',
      data: student
    });
  }
);


// POST /student
export const createStudentController = asyncHandler(
  async (req, res) => {

    let subjects = [];

    if (req.body.subjects !== undefined) {
      try {
        subjects = JSON.parse(req.body.subjects);
      } catch {
        throw new AppError('Subjects must be a valid JSON array', 400);
      }

      if (!Array.isArray(subjects)) {
        throw new AppError('Subjects must be an array', 400);
      }
    }

    let uploadedImage = null
    
    if (req.file) {
      uploadedImage = await uploadToCloudinary(req.file.buffer);
    }

    const studentData = {
      ...req.body,
      age: Number(req.body.age),
      subjects: req.body.subjects ? JSON.parse(req.body.subjects) : [],
      ...(uploadedImage && {
        profilePicture: {
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id
        }
      })
    };

    const newStudent = await createStudent(studentData);

    res.status(201).json({
      message: 'Created students successfully',
      data: newStudent
    });
  }
);


// PATCH /student/:id
export const updateStudentController = asyncHandler(
  async (req, res) => {
    const updatedStudent = await updateStudent(req.params.studentId, req.body);

    res.status(200).json({
      message: 'Student updated successfully',
      data: updatedStudent
    });
  }
);


// DELETE /student
export const deleteStudentController = asyncHandler(
  async (req, res) => {
    const deletedStudent = await deleteStudent(req.params.studentId);

    res.status(200).json({     
      message: 'Student was successfully deleted',
      data: deletedStudent   
    });
  }
);
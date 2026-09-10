import { createStudent, deleteStudent, getStudent, updateStudent } from '../services/studentService.js';
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

// POST /student
export const createStudentController = asyncHandler(
  async (req, res) => {
    const newStudent = await createStudent(req.body);

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




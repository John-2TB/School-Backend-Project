import { createClass, deleteClass, getClasses, getStudentByClass, updateClass } from "../services/classService.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// POST /class 
export const createClassController = asyncHandler(
  async (req, res) => {
    const newClass = await createClass(req.body);

    res.status(201).json({
      message: 'Class successfully created',
      data: newClass
    });
  }
);

// GET students in /class
export const getStudentByClassController = asyncHandler(
  async (req, res) => {
    const students = await getStudentByClass(req.params.classId);

    res.status(200).json({
      message: 'Students found',
      data: students
    });
  }
);

export const getClassesController = asyncHandler(
  async (req, res) => {
    const classes = await getClasses(req.params.classId);

    res.status(200).json({
      message: 'Classes found',
      data: classes
    });
  }
)


// PATCH class
export const updateClassController = asyncHandler(
  async (req, res) => {
    const updatedClass = await updateClass(req.params.classId, req.body)

    res.status(200).json({
      message: 'Class updated successfully',
      data: updatedClass
    });
  }
);


// DELETE class by ID
export const deleteClassController = asyncHandler(
  async (req, res) => {
    const deletedClass = await deleteClass(req.params.classId)

    res.status(200).json({     
      message: 'Class was successfully deleted',
      data: deletedClass   
    });
  }
);
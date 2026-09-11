import multer from "multer";
import { storage, fileFilter } from "../config/multerConfig.js";


const upload = multer({
  storage,
  fileFilter
});

export default upload;
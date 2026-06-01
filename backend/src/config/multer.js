import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";


// FIX __dirname FOR ES MODULES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// STORAGE CONFIGURATION
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      path.join(__dirname, "../../uploads")
    );
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }
});


// FILE FILTER
const fileFilter = (req, file, cb) => {

  const allowedTypes = [

  // PDF
  "application/pdf",

  // DOCX
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // PNG
  "image/png",

  // JPG
  "image/jpeg",

  // SVG
  "image/svg+xml",
];

  if (allowedTypes.includes(file.mimetype)) {

    cb(null, true);

  } else {

    cb(
      new Error("Only PDF and DOCX files allowed"),
      false
    );
  }
};


// MULTER INSTANCE
const upload = multer({

  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export default upload;
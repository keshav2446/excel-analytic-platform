const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");
const { 
  uploadExcel, 
  getUserExcelFiles, 
  getExcelFileById, 
  deleteExcelFile 
} = require("../controllers/excelController");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept only Excel files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.spreadsheet",
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed (.xls, .xlsx, .ods)"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
router.post("/upload", authMiddleware, upload.single("excelFile"), uploadExcel);
router.get("/", authMiddleware, getUserExcelFiles);
router.get("/:id", authMiddleware, getExcelFileById);
router.delete("/:id", authMiddleware, deleteExcelFile);

module.exports = router;

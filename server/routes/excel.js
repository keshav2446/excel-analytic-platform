const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ Import multer config here

const { 
  uploadExcel, 
  getUserExcelFiles, 
  getExcelFileById, 
  deleteExcelFile 
} = require("../controllers/excelController");

// ✅ Routes
router.post("/upload", authMiddleware, upload.single("excelFile"), uploadExcel);
router.get("/", authMiddleware, getUserExcelFiles);
router.get("/:id", authMiddleware, getExcelFileById);
router.delete("/:id", authMiddleware, deleteExcelFile);

module.exports = router;

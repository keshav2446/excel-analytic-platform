const Excel = require("../models/Excel");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Upload and parse Excel file
const uploadExcel = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request user:', req.user);
    console.log('Request file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename, size, mimetype } = req.file;
    console.log('File details:', { originalname, filename, size, mimetype });
    
    const filePath = path.join(__dirname, "../uploads", filename);
    console.log('File path:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "File not saved correctly" });
    }

    // Read the Excel file
    try {
      console.log('Attempting to read Excel file...');
      const workbook = XLSX.readFile(filePath);
      
      if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
        return res.status(400).json({ message: "Invalid Excel file or no sheets found" });
      }
      
      const sheetName = workbook.SheetNames[0];
      console.log('Sheet name:', sheetName);
      
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log('JSON data rows:', jsonData.length);
      
      if (!jsonData || jsonData.length === 0) {
        return res.status(400).json({ message: "Excel file contains no data" });
      }
      
      // Extract column headers
      const columns = Object.keys(jsonData[0] || {});
      console.log('Columns:', columns);
      
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "User not authenticated properly" });
      }
      
      // Create new Excel document in database
      const newExcel = new Excel({
        fileName: filename,
        originalName: originalname,
        fileSize: size,
        fileType: mimetype,
        uploadedBy: req.user._id,
        columns: columns,
        data: jsonData,
        rowCount: jsonData.length,
      });

      console.log('Saving to database...');
      await newExcel.save();
      console.log('Saved successfully with ID:', newExcel._id);

      // Remove file from uploads folder after processing
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      res.status(201).json({
        message: "Excel file uploaded and processed successfully",
        excelId: newExcel._id,
        columns: columns,
        rowCount: jsonData.length,
      });
    } catch (readError) {
      console.error('Error reading Excel file:', readError);
      return res.status(400).json({ message: "Error reading Excel file", error: readError.message });
    }
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    console.error("Error stack:", error.stack);
    // Return more detailed error message for debugging
    res.status(500).json({ 
      message: "Server error during file upload", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all Excel files for a user
const getUserExcelFiles = async (req, res) => {
  try {
    const excelFiles = await Excel.find({ uploadedBy: req.user._id })
      .select("fileName originalName fileSize fileType columns rowCount createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(excelFiles);
  } catch (error) {
    console.error("Error fetching Excel files:", error);
    res.status(500).json({ message: "Server error while fetching Excel files" });
  }
};

// Get Excel file by ID
const getExcelFileById = async (req, res) => {
  try {
    const excelFile = await Excel.findById(req.params.id);
    
    if (!excelFile) {
      return res.status(404).json({ message: "Excel file not found" });
    }

    // Check if the user is authorized to access this file
    if (excelFile.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this file" });
    }

    res.status(200).json(excelFile);
  } catch (error) {
    console.error("Error fetching Excel file:", error);
    res.status(500).json({ message: "Server error while fetching Excel file" });
  }
};

// Delete Excel file
const deleteExcelFile = async (req, res) => {
  try {
    const excelFile = await Excel.findById(req.params.id);
    
    if (!excelFile) {
      return res.status(404).json({ message: "Excel file not found" });
    }

    // Check if the user is authorized to delete this file
    if (excelFile.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this file" });
    }

    await Excel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Excel file deleted successfully" });
  } catch (error) {
    console.error("Error deleting Excel file:", error);
    res.status(500).json({ message: "Server error while deleting Excel file" });
  }
};

module.exports = {
  uploadExcel,
  getUserExcelFiles,
  getExcelFileById,
  deleteExcelFile
};

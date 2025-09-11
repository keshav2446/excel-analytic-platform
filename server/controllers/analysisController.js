const Analysis = require("../models/Analysis");
const Excel = require("../models/Excel");

// Create a new analysis
const createAnalysis = async (req, res) => {
  try {
    const { title, description, excelId, chartType, xAxis, yAxis, zAxis, chartConfig } = req.body;

    // Verify that the Excel file exists and belongs to the user
    const excelFile = await Excel.findById(excelId);
    if (!excelFile) {
      return res.status(404).json({ message: "Excel file not found" });
    }

    if (excelFile.uploadedBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to analyze this file" });
    }

    // Create new analysis
    const newAnalysis = new Analysis({
      title,
      description,
      excelFile: excelId,
      chartType,
      xAxis,
      yAxis,
      zAxis,
      chartConfig,
      createdBy: req.user.id,
    });

    await newAnalysis.save();

    res.status(201).json({
      message: "Analysis created successfully",
      analysisId: newAnalysis._id,
    });
  } catch (error) {
    console.error("Error creating analysis:", error);
    res.status(500).json({ message: "Server error during analysis creation" });
  }
};

// Get all analyses for a user
const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ createdBy: req.user.id })
      .populate({
        path: "excelFile",
        select: "fileName originalName",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(analyses);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ message: "Server error while fetching analyses" });
  }
};

// Get analysis by ID
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id)
      .populate({
        path: "excelFile",
        select: "fileName originalName columns data",
      });
    
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // Check if the user is authorized to access this analysis
    if (analysis.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this analysis" });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ message: "Server error while fetching analysis" });
  }
};

// Update analysis
const updateAnalysis = async (req, res) => {
  try {
    const { title, description, chartType, xAxis, yAxis, zAxis, chartConfig } = req.body;
    
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // Check if the user is authorized to update this analysis
    if (analysis.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this analysis" });
    }

    // Update fields
    analysis.title = title || analysis.title;
    analysis.description = description || analysis.description;
    analysis.chartType = chartType || analysis.chartType;
    analysis.xAxis = xAxis || analysis.xAxis;
    analysis.yAxis = yAxis || analysis.yAxis;
    analysis.zAxis = zAxis || analysis.zAxis;
    analysis.chartConfig = chartConfig || analysis.chartConfig;

    await analysis.save();
    
    res.status(200).json({ 
      message: "Analysis updated successfully",
      analysis
    });
  } catch (error) {
    console.error("Error updating analysis:", error);
    res.status(500).json({ message: "Server error while updating analysis" });
  }
};

// Delete analysis
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // Check if the user is authorized to delete this analysis
    if (analysis.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this analysis" });
    }

    await Analysis.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({ message: "Server error while deleting analysis" });
  }
};

// Add AI insights to an analysis
const addAiInsights = async (req, res) => {
  try {
    const { insights } = req.body;
    
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    // Check if the user is authorized to update this analysis
    if (analysis.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this analysis" });
    }

    // Update AI insights
    analysis.aiInsights = insights;
    await analysis.save();
    
    res.status(200).json({ 
      message: "AI insights added successfully",
      analysis
    });
  } catch (error) {
    console.error("Error adding AI insights:", error);
    res.status(500).json({ message: "Server error while adding AI insights" });
  }
};

module.exports = {
  createAnalysis,
  getUserAnalyses,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
  addAiInsights
};

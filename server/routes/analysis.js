const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  createAnalysis, 
  getUserAnalyses, 
  getAnalysisById, 
  updateAnalysis, 
  deleteAnalysis,
  addAiInsights
} = require("../controllers/analysisController");

// Routes
router.post("/", authMiddleware, createAnalysis);
router.get("/", authMiddleware, getUserAnalyses);
router.get("/:id", authMiddleware, getAnalysisById);
router.put("/:id", authMiddleware, updateAnalysis);
router.delete("/:id", authMiddleware, deleteAnalysis);
router.post("/:id/ai-insights", authMiddleware, addAiInsights);

module.exports = router;

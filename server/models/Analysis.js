const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    excelFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Excel",
      required: true,
    },
    chartType: {
      type: String,
      required: true,
      enum: ["bar", "line", "pie", "scatter", "bubble", "radar", "3d-column", "3d-scatter", "3d-surface"],
    },
    xAxis: {
      type: String,
      required: true,
    },
    yAxis: {
      type: String,
      required: true,
    },
    zAxis: {
      type: String,
      // Only required for 3D charts
    },
    chartConfig: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aiInsights: {
      type: String,
      // Optional field for AI-generated insights
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);
module.exports = Analysis;

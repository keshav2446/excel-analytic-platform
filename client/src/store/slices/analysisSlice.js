import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to set auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Async thunks
export const createAnalysis = createAsyncThunk(
  'analysis/create',
  async (analysisData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/analysis`, 
        analysisData, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create analysis');
    }
  }
);

export const getUserAnalyses = createAsyncThunk(
  'analysis/getUserAnalyses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/analysis`, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analyses');
    }
  }
);

export const getAnalysisById = createAsyncThunk(
  'analysis/getById',
  async (analysisId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/analysis/${analysisId}`, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analysis');
    }
  }
);

export const updateAnalysis = createAsyncThunk(
  'analysis/update',
  async ({ analysisId, analysisData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/analysis/${analysisId}`, 
        analysisData, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update analysis');
    }
  }
);

export const deleteAnalysis = createAsyncThunk(
  'analysis/delete',
  async (analysisId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/analysis/${analysisId}`, 
        getAuthHeader()
      );
      return analysisId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete analysis');
    }
  }
);

export const addAiInsights = createAsyncThunk(
  'analysis/addAiInsights',
  async ({ analysisId, insights }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/analysis/${analysisId}/ai-insights`, 
        { insights }, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add AI insights');
    }
  }
);

const initialState = {
  analyses: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create analysis
      .addCase(createAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAnalysis.fulfilled, (state) => {
        state.loading = false;
        state.createSuccess = true;
      })
      .addCase(createAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get user analyses
      .addCase(getUserAnalyses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAnalyses.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses = action.payload;
      })
      .addCase(getUserAnalyses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get analysis by ID
      .addCase(getAnalysisById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnalysisById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
      })
      .addCase(getAnalysisById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update analysis
      .addCase(updateAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.currentAnalysis = action.payload.analysis;
      })
      .addCase(updateAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete analysis
      .addCase(deleteAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses = state.analyses.filter(analysis => analysis._id !== action.payload);
        if (state.currentAnalysis && state.currentAnalysis._id === action.payload) {
          state.currentAnalysis = null;
        }
      })
      .addCase(deleteAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add AI insights
      .addCase(addAiInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAiInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload.analysis;
      })
      .addCase(addAiInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearCurrentAnalysis, 
  clearError, 
  resetCreateSuccess, 
  resetUpdateSuccess 
} = analysisSlice.actions;

export default analysisSlice.reducer;

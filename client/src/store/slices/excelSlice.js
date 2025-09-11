import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to set auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Async thunks
export const uploadExcelFile = createAsyncThunk(
  'excel/uploadFile',
  async (fileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('excelFile', fileData);
      
      const response = await axios.post(
        `${API_URL}/excel/upload`, 
        formData, 
        {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'File upload failed');
    }
  }
);

export const getUserExcelFiles = createAsyncThunk(
  'excel/getUserFiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/excel`, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Excel files');
    }
  }
);

export const getExcelFileById = createAsyncThunk(
  'excel/getFileById',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/excel/${fileId}`, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Excel file');
    }
  }
);

export const deleteExcelFile = createAsyncThunk(
  'excel/deleteFile',
  async (fileId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/excel/${fileId}`, 
        getAuthHeader()
      );
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete Excel file');
    }
  }
);

const initialState = {
  files: [],
  currentFile: null,
  columns: [],
  data: [],
  loading: false,
  error: null,
  uploadSuccess: false,
};

const excelSlice = createSlice({
  name: 'excel',
  initialState,
  reducers: {
    clearCurrentFile: (state) => {
      state.currentFile = null;
      state.columns = [];
      state.data = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUploadSuccess: (state) => {
      state.uploadSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Excel file
      .addCase(uploadExcelFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadExcelFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadSuccess = true;
        state.columns = action.payload.columns;
      })
      .addCase(uploadExcelFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get user Excel files
      .addCase(getUserExcelFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserExcelFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(getUserExcelFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Excel file by ID
      .addCase(getExcelFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExcelFileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
        state.columns = action.payload.columns;
        state.data = action.payload.data;
      })
      .addCase(getExcelFileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Excel file
      .addCase(deleteExcelFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExcelFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter(file => file._id !== action.payload);
        if (state.currentFile && state.currentFile._id === action.payload) {
          state.currentFile = null;
          state.columns = [];
          state.data = [];
        }
      })
      .addCase(deleteExcelFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentFile, clearError, resetUploadSuccess } = excelSlice.actions;
export default excelSlice.reducer;

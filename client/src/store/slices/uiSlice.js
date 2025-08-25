import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
  notifications: [],
  activeTab: 'dashboard',
  chartPreviewMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleChartPreviewMode: (state) => {
      state.chartPreviewMode = !state.chartPreviewMode;
    },
    setChartPreviewMode: (state, action) => {
      state.chartPreviewMode = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleDarkMode,
  addNotification,
  removeNotification,
  setActiveTab,
  toggleChartPreviewMode,
  setChartPreviewMode,
} = uiSlice.actions;

export default uiSlice.reducer;

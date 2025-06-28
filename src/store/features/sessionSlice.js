import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // deployment: "https://radar-backend-o1yd.onrender.com",
  deployment: "https://localhost:4000",
  serverStatus: '🟡 Initialising...',
  loadingSummary: false,
  loadingResumeImprovements: false,
  processingJobDescription: false,
  generatingCoverLetter: false,
  loadingApplyData: false
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setRadarOnline: (state) => {
      state.serverStatus = '🟢 Online';
    },
    setRadarOffline: (state) => {
      state.serverStatus = '🔴 Offline';
    },
    setLoadingSummary: (state, action) => {
      state.loadingSummary = action.payload;
    },
    setLoadingResumeImprovements: (state, action) => {
      state.loadingResumeImprovements = action.payload;
    },
    setProcessingJobDescription: (state, action) => {
      state.processingJobDescription = action.payload;
    },
    setGeneratingCoverLetter: (state, action) => {
      state.generatingCoverLetter = action.payload;
    },
    setLoadingApplyData: (state, action) => {
      state.loadingApplyData = action.payload;
    }
  }
});

export const { 
    setRadarOnline,
    setRadarOffline,
    setLoadingSummary, 
    setLoadingResumeImprovements, 
    setProcessingJobDescription, 
    setGeneratingCoverLetter, 
    setLoadingApplyData } = sessionSlice.actions;
export default sessionSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  	deployment: "https://radar-backend-o1yd.onrender.com",
	// deployment: "http://localhost:4000",
	serverStatus: '🟡 Initialising...',
	logoClientId: null,
	loadingSummary: false,
	loadingResumeImprovements: false,
	processingJobDescription: false,
	fetchingCompanyValues: false,
	generatingCoverLetter: false,
	loadingApplyData: false
};

const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		setRadarOnline: (state) => {
			state.serverStatus = '🟢 Online';
			console.log("RaDAR Online!");
		},
		setRadarOffline: (state, action) => {
			state.serverStatus = '🔴 Offline';
			console.log("RaDAR Offline! Error received:");
			console.log(action.payload);
		},
		setLogoClientId: (state, action) => {
			state.logoClientId = action.payload;
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
		setFetchingCompanyValues: (state, action) => {
			state.fetchingCompanyValues = action.payload;
		},
		setGeneratingCoverLetter: (state, action) => {
			state.generatingCoverLetter = action.payload;
		},
		setLoadingApplyData: (state, action) => {
			state.loadingApplyData = action.payload;
		},
		resetSession: () => initialState
	}
});

export const { 
    setRadarOnline,
    setRadarOffline,
	setLogoClientId,
    setLoadingSummary, 
    setLoadingResumeImprovements, 
    setProcessingJobDescription, 
	setFetchingCompanyValues,
    setGeneratingCoverLetter, 
    setLoadingApplyData,
	resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
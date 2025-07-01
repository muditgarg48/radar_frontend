import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  	deployment: "https://radar-backend-o1yd.onrender.com",
	// deployment: "http://localhost:4000",
	serverStatus: '🟡 Initialising...',
	applicationHistory: null,
	logoClientId: null,
	loadingSummary: false,
	loadingResumeImprovements: false,
	processingJobDescription: false,
	fetchingCompanyValues: false,
	companyValuesVisibility: false,
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
		setApplicationHistory: (state, action) => {
			state.applicationHistory = action.payload;
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
		showCompanyValues: (state) => {
			state.companyValuesVisibility = true;
		},
		hideCompanyValues: (state) => {
			state.companyValuesVisibility = false;
		},
		setGeneratingCoverLetter: (state, action) => {
			state.generatingCoverLetter = action.payload;
		},
		setLoadingApplyData: (state, action) => {
			state.loadingApplyData = action.payload;
		},
		invalidateData: () => {
			localStorage.clear();
			alert("RaDAR data cleared!")
		},
		resetSession: () => initialState
	}
});

export const { 
    setRadarOnline,
    setRadarOffline,
	setApplicationHistory,
	setLogoClientId,
    setLoadingSummary, 
    setLoadingResumeImprovements, 
    setProcessingJobDescription, 
	setFetchingCompanyValues,
	showCompanyValues,
	hideCompanyValues,
    setGeneratingCoverLetter, 
    setLoadingApplyData,
	invalidateData,
	resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
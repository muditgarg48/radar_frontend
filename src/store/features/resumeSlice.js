import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  	// resumeFile: null,
  	resumeText: null,
  	resumeUrl: null,
  	resumeSummary: null,
  	resumeImprovements: null,
  	resumeAlignmentScore: 0,
};

const resumeSlice = createSlice({
  	name: 'resume',
  	initialState,
  	reducers: {
    	// setResumeFile: (state, action) => {
      	// 	state.resumeFile = action.payload;
    	// },
    	setResumeText: (state, action) => {
      		state.resumeText = action.payload;
    	},
    	setResumeUrl: (state, action) => {
      		state.resumeUrl = action.payload;
    	},
    	setResumeSummary: (state, action) => {
      		state.resumeSummary = action.payload;
    	},
    	setResumeImprovements: (state, action) => {
      		state.resumeImprovements = action.payload;
    	},
    	setResumeAlignmentScore: (state, action) => {
      		state.resumeAlignmentScore = action.payload;
    	},
    	resetResumeData: () => initialState
  	}
});

export const { 
	// setResumeFile, 
	setResumeText, 
	setResumeUrl, 
	setResumeSummary, 
	setResumeImprovements, 
	setResumeAlignmentScore, 
	resetResumeData } = resumeSlice.actions;
export default resumeSlice.reducer;
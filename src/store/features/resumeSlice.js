import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  	file: null,
  	text: null,
  	url: null,
  	summary: null,
  	improvements: null,
  	alignmentScore: 0,
};

const resumeSlice = createSlice({
  	name: 'resume',
  	initialState,
  	reducers: {
    	setResumeFile: (state, action) => {
      		state.file = action.payload;
    	},
    	setResumeText: (state, action) => {
      		state.text = action.payload;
    	},
    	setResumeUrl: (state, action) => {
      		state.url = action.payload;
    	},
    	setResumeSummary: (state, action) => {
      		state.summary = action.payload;
    	},
    	setResumeImprovements: (state, action) => {
      		state.improvements = action.payload;
    	},
    	setResumeAlignmentScore: (state, action) => {
      		state.alignmentScore = action.payload;
    	},
    	resetResumeData: () => initialState
  	}
});

export const { 
	setResumeFile, 
	setResumeText, 
	setResumeUrl, 
	setResumeSummary, 
	setResumeImprovements, 
	setResumeAlignmentScore, 
	resetResumeData } = resumeSlice.actions;
export default resumeSlice.reducer;
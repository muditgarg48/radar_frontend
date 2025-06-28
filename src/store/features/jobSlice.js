import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    description: null,
    title: null,
    keywords: null,
    presentKeywords: null,
    experienceLevel: null,
    salaryBracket: null,
    teamName: null,
    sponsorship: null,                             
    location: null,
    benefits: null,
    keyNotes: null,
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setJobDescription: (state, action) => {
            state.description = action.payload;
        },
        setJobTitle: (state, action) => {
            state.title = action.payload;
        },
        setJobKeywords: (state, action) => {
            state.keywords = action.payload;
        },
        setJobExperienceLevel: (state, action) => {
            state.experienceLevel = action.payload;
        },
        setJobSalaryBracket: (state, action) => {
            state.salaryBracket = action.payload;
        },
        setJobTeamName: (state, action) => {
            state.teamName = action.payload;
        },
        setJobSponsorship: (state, action) => {
            state.sponsorship = action.payload;
        },
        setJobLocation: (state, action) => {
            state.location = action.payload;
        },
        setJobBenefits: (state, action) => {
            state.benefits = action.payload;
        },
        setJobKeyNotes: (state, action) => {
            state.keyNotes = action.payload;
        },
        resetJob: () => initialState
    }
});

export const { 
    setJobDescription, 
    setJobTitle, 
    setJobKeywords, 
    setJobExperienceLevel, 
    setJobSalaryBracket, 
    setJobTeamName, 
    setJobSponsorship, 
    setJobLocation, 
    setJobBenefits, 
    setJobKeyNotes, 
    resetJob } = jobSlice.actions;
export default jobSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    jobDescription: null,
    jobTitle: null,
    jdKeywords: null,
    experienceLevel: null,
    salaryBracket: null,
    teamName: null,
    sponsorship: null,                             
    location: null,
    benefits: null,
    jdKeyNotes: null,
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setJobDescription: (state, action) => {
            state.jobDescription = action.payload;
        },
        setJobTitle: (state, action) => {
            state.jobTitle = action.payload;
        },
        setJobKeywords: (state, action) => {
            state.jdKeywords = action.payload;
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
            state.jdKeyNotes = action.payload;
        },
        setJobDetails: (state, action) => {
            const data = action.payload;
            state.jobTitle = data.title;
            state.jdKeywords = data.keywords;
            state.jdKeyNotes = data.notes;
            if ("salary_bracket" in data) state.salaryBracket = data.salary_bracket;
            if ("experience_level" in data) state.experienceLevel = data.experience_level;
            if ("team_name" in data) state.teamName = data.team_name;
            if ("visa_sponsorship" in data) state.sponsorship = data.visa_sponsorship;
            if ("location" in data) state.location = data.location;
            if ("benefits" in data) state.benefits = data.benefits;
        },
        resetJobData: () => initialState
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
    setJobDetails,
    resetJobData } = jobSlice.actions;
export default jobSlice.reducer;
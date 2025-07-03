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
    specialRequirements: null,
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
        setSpecialRequirements: (state, action) => {
            state.specialRequirements = action.payload;
        },
        setJobBenefits: (state, action) => {
            state.benefits = action.payload;
        },
        setJobKeyNotes: (state, action) => {
            state.jdKeyNotes = action.payload;
        },
        setJobDetails: (state, action) => {
            const data = action.payload;
            try {
                state.jobTitle = data.title;
                state.jdKeywords = data.keywords;
                state.jdKeywords["hard_skills"] = data.keywords.hard_skills.split(";");
                state.jdKeywords["soft_skills"] = data.keywords.soft_skills.split(";");
                state.jdKeywords["other_keywords"] = data.keywords.other_keywords.split(";");
                state.jdKeyNotes = data.notes;
                if ("special_requirements" in data) state.specialRequirements = data.special_requirements?.split(";");
                if ("salary_bracket" in data) state.salaryBracket = data.salary_bracket?.split(";");
                if ("experience_level" in data) state.experienceLevel = data.experience_level?.split(";");
                if ("team_name" in data) state.teamName = data.team_name;
                if ("visa_sponsorship" in data) state.sponsorship = data.visa_sponsorship;
                if ("location" in data) state.location = data.location?.split(";");
                if ("benefits" in data) state.benefits = data.benefits;
            } catch (error) {
                console.error("Error encountered when interpreting the processed job data: " + error);
                console.log(data);
            }
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
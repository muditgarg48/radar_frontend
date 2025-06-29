import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    coverLetter: null,
    coverLetterImprovements: null,
    coverLetterContext: null,
    loadingCoverLetter: null,

    additionalMessage: null,
    additionalMessageImprovements: null,
    additionalMessageContext: null,
    loadingAdditionalMessage: null
};

const additionalDocsSlice = createSlice({
  	name: 'additionalDocs',
  	initialState,
  	reducers: {
        setCoverLetter: (state, action) => {
            state.coverLetter = action.payload;
        },
        setCoverLetterImprovements: (state, action) => {
            state.coverLetterImprovements = action.payload;
        },
        setCoverLetterContext: (state, action) => {
            state.coverLetterContext = action.payload;
        },
        setLoadingCoverLetter: (state, action) => {
            state.loadingCoverLetter = action.payload;
        },
        setCoverLetterDetails: (state, actions) => {
            state.coverLetter = actions.payload.cover_letter;
            state.coverLetterImprovements = actions.payload.improvements;
        },
        resetCoverLetter: (state) => {
            state.coverLetter = null;
            state.coverLetterImprovements = null;
            state.coverLetterContext = null;
            state.loadingCoverLetter = null;
        },

        setAdditionalMessage: (state, action) => {
            state.additionalMessage = action.payload;
        },
        setAdditionalMessageImprovements: (state, action) => {
            state.additionalMessageImprovements = action.payload;
        },
        setAdditionalMessageContext: (state, action) => {
            state.additionalMessageContext = action.payload;
        },
        setLoadingAdditionalMessage: (state, action) => {
            state.loadingAdditionalMessage = action.payload;
        },
        setAdditionalMessageDetails: (state, actions) => {
            state.additionalMessage = actions.payload.additional_msg;
            state.additionalMessageImprovements = actions.payload.improvements;
        },
        resetAdditionalMessage: (state) => {
            state.additionalMessage = null;
            state.additionalMessageImprovements = null;
            state.additionalMessageContext = null;
            state.loadingAdditionalMessage = null;
        },
        resetAllAdditionalDocs: () => initialState
	}
});

export const { 
    setCoverLetter, 
    setCoverLetterImprovements, 
    setCoverLetterContext,
    setCoverLetterDetails, 
    setLoadingCoverLetter,
    resetCoverLetter,
    
    setAdditionalMessage,
    setAdditionalMessageImprovements,
    setAdditionalMessageDetails,
    setAdditionalMessageContext,
    setLoadingAdditionalMessage,
    resetAdditionalMessage,

    resetAllAdditionalDocs } = additionalDocsSlice.actions;
export default additionalDocsSlice.reducer;
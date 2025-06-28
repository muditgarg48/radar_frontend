import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  values: null,
  domain: null,
  glassdoor_link: null
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyName: (state, action) => {
        state.name = action.payload;
    },
    setValues: (state, action) => {
        state.values = action.payload;
    },
    setDomain: (state, action) => {
        state.domain = action.payload;
    },
    setGlassdoorLink: (state, action) => {
        state.glassdoor_link = action.payload;
    },
    resetCompanyData: () => initialState
  }
});

export const { 
    setCompanyName, 
    setValues, 
    setDomain, 
    setGlassdoorLink, 
    resetCompanyData } = companySlice.actions;
export default companySlice.reducer;
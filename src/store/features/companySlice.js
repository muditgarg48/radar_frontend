import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  	companyName: null,
  	companyValues: null,
	companyValuesLink: null,
  	companyDomain: null,
  	companyGlassdoorLink: null
};

const companySlice = createSlice({
  	name: 'company',
  	initialState,
  	reducers: {
		setCompanyName: (state, action) => {
			state.companyName = action.payload;
		},
		setValues: (state, action) => {
			state.companyValues = action.payload;
		},
		setCompanyValuesLink: (state, action) => {
			state.companyValuesLink = action.payload;
		},
		setDomain: (state, action) => {
			state.companyDomain = action.payload;
		},
		setGlassdoorLink: (state, action) => {
			state.companyGlassdoorLink = action.payload;
		},
		resetCompanyData: () => initialState
	}
});

export const { 
    setCompanyName, 
    setValues, 
	setCompanyValuesLink,
    setDomain, 
    setGlassdoorLink, 
    resetCompanyData } = companySlice.actions;
export default companySlice.reducer;
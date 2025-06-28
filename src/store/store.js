import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './features/sessionSlice';
import resumeReducer from './features/resumeSlice';
import jobReducer from './features/jobSlice';
import companyReducer from './features/companySlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    resume: resumeReducer,
    job: jobReducer,
    company: companyReducer
  }
});
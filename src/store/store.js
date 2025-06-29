import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './features/sessionSlice';
import resumeReducer from './features/resumeSlice';
import jobReducer from './features/jobSlice';
import companyReducer from './features/companySlice';
import additionalDocsReducer from './features/additionalDocsSlice';

const store = configureStore({
	reducer: {
		session: sessionReducer,
		resume: resumeReducer,
		job: jobReducer,
		company: companyReducer,
		additionalDocs: additionalDocsReducer,
	}
});

export default store;
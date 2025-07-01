import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRadarOnline, setRadarOffline, resetSession } from "./store/features/sessionSlice.js";
import { resetCompanyData } from "./store/features/companySlice.js";
import { resetJobData } from "./store/features/jobSlice.js";
import { resetResumeData } from "./store/features/resumeSlice.js";
import { resetAllAdditionalDocs } from "./store/features/additionalDocsSlice.js";
import axios from "axios";

import HistorySection from "./sections/HistorySection/HistorySection.jsx";
import ResumeSection from "./sections/ResumeSection/ResumeSection.jsx";
import ApplySection from "./sections/ApplySection/ApplySection.jsx";
import IntroductionSection from "./sections/IntroductionSection/IntroductionSection.jsx";
import JDSection from "./sections/JDSection/JDSection.jsx";

import './App.css';

function App() {

	const dispatch = useDispatch();
  	const deployment = useSelector((state) => state.session.deployment);

  	useEffect(() => {
    	
		function resetAllData() {
			dispatch(resetSession());
			dispatch(resetCompanyData());
			dispatch(resetJobData());
			dispatch(resetResumeData());
			dispatch(resetAllAdditionalDocs());
		}
		async function checkServerStatus() {
      		try {
        		const response = await axios.get(deployment+"/hello-server");
				if(response.status === 200) {
					dispatch(setRadarOnline());
				} else {
					dispatch(setRadarOffline("Server side error: "+response));
				}
      		} catch (Exception) {
				dispatch(setRadarOffline("Client side error: "+Exception));
        		alert("Server response: "+Exception+". Report back to the developer.");
      		}
    	}
    	checkServerStatus();
  	}, [deployment]);

	return (
		<div>
			<IntroductionSection/>
			<HistorySection/>
			<ResumeSection/>
			<JDSection/>
			&nbsp;
			&nbsp;
			<ApplySection/>
		</div>
	);
}

export default App;
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRadarOnline, setRadarOffline, resetSession } from "./store/features/sessionSlice.js";
import { resetCompanyData } from "./store/features/companySlice.js";
import { resetJobData } from "./store/features/jobSlice.js";
import { resetResumeData } from "./store/features/resumeSlice.js";
import { resetAllAdditionalDocs } from "./store/features/additionalDocsSlice.js";
import axios from "axios";

import ResumeSection from "./sections/ResumeSection/ResumeSection.jsx";
import ApplySection from "./sections/ApplySection/ApplySection.jsx";
import IntroductionSection from "./sections/IntroductionSection/IntroductionSection.jsx";
import JDSection from "./sections/JDSection/JDSection.jsx";

import './App.css';

function App() {

	const dispatch = useDispatch();
  	
	// const [serverStatus, setServerStatus] = useState("🟡 Initialising...");

  	// const [resume, setResume] = useState(null);
  	// const [resumeUrl, setResumeUrl] = useState(null);
  	// const [jobDescription, setJobDescription] = useState("");
  	// const [jobTitle, setJobTitle] = useState(null);
  	// const [jobCompany, setJobCompany] = useState(null);

  	// Development
  	// const deployment = "http://localhost:4000";
  	// Production
  	// const deployment = "https://radar-backend-o1yd.onrender.com";
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
					// setServerStatus("🟢 Online");
					dispatch(setRadarOnline());
					// console.log("RaDAR Online!");
				} else {
					dispatch(setRadarOffline("Server side error: "+response));
					// console.log("This is weird. Server status: "+response);
				}
      		} catch (Exception) {
        		// setServerStatus("🔴 Offline");
				dispatch(setRadarOffline("Client side error: "+Exception));
        		alert("Server response: "+Exception+". Report back to the developer.");
      		}
    	}
    	checkServerStatus();
  	}, [deployment]);

	return (
		<div>
			<IntroductionSection
				// serverStatus={serverStatus}
			/>
			<ResumeSection 
				// deployment={deployment}
				// setResume={setResume}
				// resume={resume}
				// setResumeUrl={setResumeUrl}
				// resumeUrl={resumeUrl}
			/>
			<JDSection 
				// deployment={deployment}
				// setJobDescription={setJobDescription}
				// jobDescription={jobDescription}
				// setJobTitle={setJobTitle}
				// jobTitle={jobTitle}
				// setJobCompany={setJobCompany}
				// jobCompany={jobCompany}
				// resume={resume}
			/>
			&nbsp;
			&nbsp;
			<ApplySection 
				// deployment={deployment}
				// serverStatus={serverStatus}
			/>
		</div>
	);
}

export default App;
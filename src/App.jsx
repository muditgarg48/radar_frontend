import React, { useState, useEffect } from "react";
import axios from "axios";

import ResumeSection from "./sections/ResumeSection/ResumeSection.jsx";
import AdditionalDocSection from "./sections/AdditionalDocSection/AdditionalDocSection.jsx";
import ApplySection from "./sections/ApplySection/ApplySection.jsx";
import IntroductionSection from "./sections/IntroductionSection/IntroductionSection.jsx";
import JDSection from "./sections/JDSection/JDSection.jsx";

import './App.css';

function App() {

  const [serverStatus, setServerStatus] = useState("🟡 Initialising...");

  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState(null);
  const [jobCompany, setJobCompany] = useState(null);

  // Development
  const deployment = "http://localhost:4000";
  // Production
  // const deployment = "https://radar-backend-o1yd.onrender.com";

  useEffect(() => {
    async function checkServerStatus() {
      try {
        const response = await axios.get(deployment+"/hello-server");
        if(response.status === 200) {
          setServerStatus("🟢 Online");
          console.log("RaDAR Online!");
        } else {
          console.log("This is weird. Server status: "+response);
        }
      } catch (Exception) {
        setServerStatus("🔴 Offline");
        alert("Server response: "+Exception+". Report back to the developer.");
      }
    }
    checkServerStatus();
  }, []);

  return (
    <div>
      <IntroductionSection
        serverStatus={serverStatus}
      />
      <ResumeSection 
        deployment={deployment}
        setResume={setResume}
        resume={resume}
        setResumeUrl={setResumeUrl}
        resumeUrl={resumeUrl}
      />
      <JDSection 
        deployment={deployment}
        setJobDescription={setJobDescription}
        jobDescription={jobDescription}
        setJobTitle={setJobTitle}
        jobTitle={jobTitle}
        setJobCompany={setJobCompany}
        jobCompany={jobCompany}
        resume={resume}
        />
      &nbsp;
      <AdditionalDocSection 
        resume={resume}
        jobDescription={jobDescription}
        jobTitle={jobTitle}
        jobCompany={jobCompany}
        deployment={deployment}
        />
      &nbsp;
      &nbsp;
      <ApplySection 
        deployment={deployment}
      />
    </div>
  );
}

export default App;
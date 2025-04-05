import React, { useState } from "react";
import ResumeSection from "./ResumeSection/ResumeSection.jsx";
import AdditionalDocSection from "./AdditionalDocSection/AdditionalDocSection.jsx";
import ApplySection from "./ApplySection/ApplySection.jsx";
import IntroductionSection from "./IntroductionSection/IntroductionSection.jsx";
import JDSection from "./JDSection/JDSection.jsx";
import './App.css';

function App() {

  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState(null);
  const [jobCompany, setJobCompany] = useState(null);

  // Development
  // const deployment = "http://localhost:4000";
  // Production
  const deployment = "https://radar-backend-o1yd.onrender.com";

  return (
    <div>
      <IntroductionSection/>
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
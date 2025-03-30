import React, { useState } from "react";
import ResumeSection from "./ResumeSection/ResumeSection.jsx";
import AdditionalDocSection from "./AdditionalDocSection/AdditionalDocSection.jsx";
import './App.css';

function App() {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  // const [embeddingsGenerated, setEmbeddingsGenerated] = useState(false);
  const [jobDescription, setJobDescription] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobCompany, setJobCompany] = useState(null);
  const [jobKeywords, setJobKeywords] = useState(null);
  const [jobKeyNotes, setJobKeyNotes] = useState(null);

  const deployment = "http://localhost:4000";

  // Handle job description input
  const handleJobDescriptionSubmit = async () => {
    const response = await fetch(deployment+"/process-job-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "jd":jobDescription }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Job Description Processed:", result);
      setJobTitle(result.title);
      setJobCompany(result.company);
      setJobKeywords(result.keywords);
      setJobKeyNotes(result.notes);
    }
  };

  return (
    <div>
      <h1>RADAR: Resume and Job Description Analyzer</h1>

      <ResumeSection 
        deployment={deployment}
        setResume={setResume}
        resume={resume}
        setResumeUrl={setResumeUrl}
        resumeUrl={resumeUrl}
      />

      {/* Job Description Input */}
      <div id="jd-section">
        <h2>Job Description</h2>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          />
        &nbsp;
        {jobDescription && <div id="jd-preview">
          {jobDescription} 
        </div>}
        &nbsp;
        <button onClick={handleJobDescriptionSubmit}>Process Job Description</button>
        &nbsp;
        {jobTitle && jobCompany &&<p>
          <b>Job Details:</b> <br/>
          {jobTitle && <span>{jobTitle}</span>} at {jobCompany && <span>{jobCompany}</span>} 
        </p>}
        {jobKeywords &&<div>
          <b>Suggested keywords</b> to be included in the application:
          <ul id="jd-keywords-section">
            {jobKeywords.map((word, index) => {
              // const keyword = word.substring(1, word.length - 1);
              return (<li class="jd-keyword" key={index}>{word}</li>)
            })}
          </ul>
        </div>}
        {jobKeyNotes &&<div>
          <u>Note:</u>
          <ul>
            {jobKeyNotes.map((note, index) => {
              // const keyword = word.substring(1, word.length - 1);
              return (<li key={index}>{note}</li>)
            })}
          </ul>
        </div>}
        <AdditionalDocSection 
          resume={resume}
          jobDescription={jobDescription}
          jobTitle={jobTitle}
          jobCompany={jobCompany}
          deployment={deployment}
        />
      </div>
    </div>
  );
}

export default App;
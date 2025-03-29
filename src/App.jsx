import React, { useState } from "react";
import ResumeSection from "./ResumeSection/ResumeSection.jsx";
import './App.css';

function App() {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  // const [embeddingsGenerated, setEmbeddingsGenerated] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobKeywords, setJobKeywords] = useState([]);
  const [jobKeyNotes, setJobKeyNotes] = useState([]);
  const [coverLetter, setCoverLetter] = useState({});
  const [coverLetterImprovements, setCoverLetterImprovements] = useState([]);

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

  const handleCoverLetterGeneration = async () => {

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jd', jobDescription);
    formData.append('position', jobTitle);
    formData.append('company', jobCompany);

    const response = await fetch(deployment+"/generate-cover-letter", {
      method: "POST",
      body: formData
    });


    if (response.ok) {
      const result = await response.json();
      console.log("Cover Letter generated:", result.cover_letter);
      setCoverLetter(result.cover_letter);
      setCoverLetterImprovements(result.improvements);
    }
  }

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
        <button onClick={handleJobDescriptionSubmit}>Process Job Description</button>
        &nbsp;
        {jobDescription && <div id="jd-preview">
          {jobDescription} 
        </div>}
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
        <button onClick={handleCoverLetterGeneration}>Generate Cover Letter</button>
        &nbsp;
        {coverLetter && <div id="cover-letter">
          <h3>Cover Letter</h3>
          <p id="cover-letter-greeting">{coverLetter.greeting}</p>
          <div id="cover-letter-body">
            <p>{coverLetter.opening_paragraph}</p>
            <p>{coverLetter.body_paragraph}</p>
            <p>{coverLetter.closing_paragraph}</p>
          </div>
          <div id="cover-letter-signature">
            <p>{coverLetter.sign_off}</p>
            <p>{coverLetter.signature}</p>
          </div>
        </div>}
        {coverLetterImprovements &&<div>
          <u>Improvements for final version:</u>
          <ul>
            {coverLetterImprovements.map((improvement, index) => {
              // const keyword = word.substring(1, word.length - 1);
              return (<li key={index}>{improvement}</li>)
            })}
          </ul>
        </div>}
      </div>
    </div>
  );
}

export default App;
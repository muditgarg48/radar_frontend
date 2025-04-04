import React, { useState } from "react";
import './JDSection.css';

export default function JDSection({deployment, setJobDescription, jobDescription, setJobTitle, setJobCompany, jobCompany, jobTitle}) {
    
    const [jobKeywords, setJobKeywords] = useState(null);
    const [jobKeyNotes, setJobKeyNotes] = useState(null);

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

    const InputJD = () => {
        return (
            <textarea
                id="jd-input"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
            />
        );
    }

    const JDPreview = () => {
        if (!jobDescription) {return null}
        return (
            <div id="jd-preview">
                {jobDescription} 
            </div>
        );
    }

    const JHeader = () => {
        if (!jobTitle || !jobCompany) {return null;}
        return (
            <p>
                <b>Job Details:</b>
                <br/>
                {jobTitle && <span>{jobTitle}</span>} at {jobCompany && <span>{jobCompany}</span>} 
            </p>
        );
    }

    const JKeywords = () => {
        if (!jobKeywords) {return null;}
        return (
            <div>
                <b>Suggested keywords</b> to be included in the application:
                <ul id="jd-keywords-section">
                {
                    jobKeywords.map((word, index) => {
                        return (<li class="jd-keyword" key={index}>{word}</li>)
                    })
                }
                </ul>
            </div>
        );
    }

    const JNotes = () => {
        if (!jobKeyNotes) {return null;}
        return (
            <div>
                <u>Note:</u>
                <ul>
                {
                    jobKeyNotes.map((note, index) => {
                        return (<li key={index}>{note}</li>)
                    })
                }
                </ul>
            </div>
        );
    }
    
    return (
        <div id="jd-section">
        <h2>Job Description</h2>
        <InputJD/>
        &nbsp;
        <JDPreview/>
        &nbsp;
        <button onClick={handleJobDescriptionSubmit}>Process Job Description</button>
        &nbsp;
        <JHeader/>
        <JKeywords/>
        <JNotes/>
      </div>
    );
}
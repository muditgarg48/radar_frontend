import React, { useState } from "react";
import Loading from '../components/Loading/Loading.jsx';
import './JDSection.css';

export default function JDSection({deployment, setJobDescription, jobDescription, setJobTitle, setJobCompany, jobCompany, jobTitle, resume}) {
    
    const [jobKeywords, setJobKeywords] = useState(null);
    const [jobKeyNotes, setJobKeyNotes] = useState(null);
    const [jdCache, setJDCache] = useState("");
    const [resumeText, setResumeText] = useState(null);

    const [loading, setLoading] = useState(false);
    const [highlightKeywords, setHighlightKeywords] = useState(false);

    const handleJobDescriptionSubmit = async () => {

        if (jdCache === "") {
            alert("Please enter a job description.");
            return;
        }

        setLoading(true);
        setJobDescription(jdCache);

        if (resume) {
            const formData = new FormData();
            formData.append('resume', resume);
            const response = await fetch(deployment+"/get-resume-text", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                setHighlightKeywords(true);
                const result = await response.text();
                setResumeText(result);
            } else {
                alert("Failed to get resume text.");
            }
        }

        const response = await fetch(deployment+"/process-job-description", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "jd": jdCache}),
        });

        if (response.ok) {
            const result = await response.json();
            setJobTitle(result.title);
            setJobCompany(result.company);
            setJobKeywords(result.keywords);
            setJobKeyNotes(result.notes);
        }

        setLoading(false);
    };

    const InputJD = () => {
        return (
            <textarea
                id="jd-input"
                rows={20}
                value={jdCache}
                onChange={(e) => setJDCache(e.target.value)}
                placeholder="Paste job description here..."
                wrap="soft"
            />
        );
    };

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

    function checkResumeForKeyword (word) {
        if (!resumeText) {return false;}
        if (!highlightKeywords) {return false;}
        return resumeText.toLowerCase().includes(word.toLowerCase());
    }

    const JKeywords = () => {
        if (!jobKeywords) {return null;}
        return (
            <div>
                <b>Suggested keywords</b> to be included in the application:
                <ul id="jd-keywords-section">
                {
                    jobKeywords.map((word, index) => {
                        return (
                            <li className={checkResumeForKeyword(word) ? "jd-keyword keyword-present" : "jd-keyword"} key={index}>
                                {word}
                            </li>
                        )
                    })
                }
                </ul>
                {highlightKeywords? <div id="jd-keywords-footnote">
                    <span className="jd-keyword keyword-present">Green</span> indicate that the keyword was found in your resume.
                </div>: <div id="jd-keywords-footnote">
                    <a href="#introduction-section">Add resume</a> and process JD again to check which keywords were found in your resume.
                </div>}
                &nbsp;
            </div>
        );
    }

    const JNotes = () => {
        if (!jobKeyNotes) {return null;}
        return (
            <div>
                <u>Note:</u>
                <ul id="jd-note">
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
            <h2 className="section-heading">Job Description</h2>
            {/* <InputJD value={jdCache} onChange={handleJDChange}/> */}
            <InputJD/>
            &nbsp;
            {/* <JDPreview/>
            &nbsp; */}
            <button onClick={handleJobDescriptionSubmit}>Process Job Description</button>
            &nbsp;
            <Loading loading={loading} message="Processing the Job Description"/>
            <JHeader/>
            <JKeywords/>
            <JNotes/>
        </div>
    );
}
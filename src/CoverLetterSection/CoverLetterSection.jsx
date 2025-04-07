import React, { useState } from "react";
import Loading from "../components/Loading/Loading";
import './CoverLetterSection.css';

export default function CoverLetterSection({resume, jobDescription, jobTitle, jobCompany, deployment}) {
    
    const [coverLetter, setCoverLetter] = useState(null);
    const [coverLetterImprovements, setCoverLetterImprovements] = useState(null);
    const [coverLetterContext, setCoverLetterContext] = useState(null);

    const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
    
    const handleCoverLetterGeneration = async () => {
        
        setCoverLetter(null);
        setCoverLetterImprovements(null);

        if (resume === null) {
            alert("Please upload a resume first.");
            return;
        } else if (jobDescription === "") {
            alert("Please enter a job description and process it first.");
            return;
        } else if (jobTitle === ""  || jobCompany === "") {
            alert("Please process the job description first");
            return;
        }
        
        setLoadingCoverLetter(true);
        
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('jd', jobDescription);
        formData.append('position', jobTitle);
        formData.append('company', jobCompany);
        formData.append('context', coverLetterContext);

        const response = await fetch(deployment+"/generate-cover-letter", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Cover Letter generated:", result.cover_letter);
            setCoverLetter(result.cover_letter);
            setCoverLetterImprovements(result.improvements);
        } else {
            console.log("Error generating cover letter");
            console.log(response.json().then(data => console.log(data.error)));
        }

        setLoadingCoverLetter(false);
    }
    
    return (
        <div>
            <h3>Cover Letter</h3>
            <div>
                <h4>Context for your cover letter (optional)</h4>
                <textarea
                    rows={5}
                    id="cover-letter-context" 
                    placeholder="Cover letter context" 
                    onChange={(e) => setCoverLetterContext(e.target.value)}
                />
            </div>
            &nbsp;
            <button id="gen-cover-letter" onClick={handleCoverLetterGeneration}>Generate Cover Letter</button>
            &nbsp;
            <Loading 
                loading={loadingCoverLetter} 
                message={
                    coverLetterContext?
                    "Generating Cover Letter using JB, Resume and User context":
                    "Generating Cover Letter using the Job Description and your resume"
                }
            />
            {coverLetter && <div id="cover-letter">
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
            {coverLetterImprovements && <div>
                <u>Improvements for final version:</u>
                <ul>
                    {coverLetterImprovements.map((improvement, index) => {
                    // const keyword = word.substring(1, word.length - 1);
                    return (<li key={index}>{improvement}</li>)
                    })}
                </ul>
            </div>}
        </div>
    );
}
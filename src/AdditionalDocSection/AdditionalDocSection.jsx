import React, { useState } from "react";
import './AdditionalDocSection.css';

export default function AdditionalDocSection({resume, jobDescription, jobTitle, jobCompany, deployment}) {

    const [coverLetter, setCoverLetter] = useState(null);
    const [coverLetterImprovements, setCoverLetterImprovements] = useState(null);
    
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
        } else {
            console.log("Error generating cover letter");
            console.log(response.json().then(data => console.log(data.error)));
        }
    }
    
    return (
        <div>
            <h2 className="section-heading  ">Cover Letter</h2>
            <p>
                Please note, you <strong>MUST NOT</strong> use this generated cover letter directly. It has been generated based on your resume and job description via a Generative AI and it bound to have a lot of issues and will lack the personal touch of a human. Recruiters and Hiring Managers are capable of easily identifying AI generated resumes and cover letters.
                <br/>
                Instead, use this cover letter as a starting point for your own cover letter. There will be some suggestions on how to start to improve this generated cover letter. Use them as your guide and make your own cover letter.
            </p>
            <button id="gen-cover-letter" onClick={handleCoverLetterGeneration}>Generate Cover Letter</button>
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
import React, { useState } from "react";

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
        }
    }
    
    return (
        <div>
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
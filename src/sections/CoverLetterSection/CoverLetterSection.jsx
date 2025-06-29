import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoadingCoverLetter, setCoverLetterDetails, setCoverLetterContext, resetCoverLetter } from "../../store/features/additionalDocsSlice";
import Loading from "../../components/Loading/Loading";
import './CoverLetterSection.css';

export default function CoverLetterSection() {

    const dispatch = useDispatch();
    const { deployment } = useSelector((state) => state.session);
    const { resumeFile } = useSelector((state) => state.resume);
    const { jobDescription, jobTitle } = useSelector((state) => state.job);
    const { companyName } = useSelector((state) => state.company);
    
    // const [coverLetter, setCoverLetter] = useState(null);
    // const [coverLetterImprovements, setCoverLetterImprovements] = useState(null);
    const [letterContext, maintainLetterContext] = useState(null);

    // const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
    const { coverLetter, coverLetterContext, coverLetterImprovements, loadingCoverLetter } = useSelector((state) => state.additionalDocs);
    
    const handleCoverLetterGeneration = async () => {
        
        // setCoverLetter(null);
        // setCoverLetterImprovements(null);
        dispatch(resetCoverLetter());
        dispatch(setCoverLetterContext(letterContext));

        if (resumeFile === null) {
            alert("Please upload a resume first.");
            return;
        } else if (jobDescription === "") {
            alert("Please enter a job description and process it first.");
            return;
        } else if (jobTitle === ""  || companyName === "") {
            alert("Please process the job description first");
            return;
        }
        
        // setLoadingCoverLetter(true);
        dispatch(setLoadingCoverLetter(true));
        
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jd', jobDescription);
        formData.append('position', jobTitle);
        formData.append('company', companyName);
        formData.append('context', coverLetterContext);

        const response = await fetch(deployment+"/generate-cover-letter", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            // console.log("Cover Letter generated:", result.cover_letter);
            // setCoverLetter(result.cover_letter);
            // setCoverLetterImprovements(result.improvements);
            dispatch(setCoverLetterDetails(result));
        } else {
            console.log("Error generating cover letter");
            console.log(response.json().then(data => console.log(data.error)));
        }

        // setLoadingCoverLetter(false);
        dispatch(setLoadingCoverLetter(false));
    }
    
    return (
        <div id="cover-letter-section">
            <h2>Cover Letter</h2>
            <div>
                <h4>Context for your cover letter (optional)</h4>
                <textarea
                    rows={2}
                    id="cover-letter-context" 
                    placeholder="Cover letter context" 
                    onChange={(e) => maintainLetterContext(e.target.value)}
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
            {coverLetterImprovements && <div id="cover-letter-improvements">
                <div style={{fontSize: "1.2rem", fontWeight: "bold"}}>✏️ Improvements for final version:</div>
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
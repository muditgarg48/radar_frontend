import React from "react";
import './AdditionalDocSection.css';

import AdditionalMessageSection from "../AdditionalMessageSection/AdditionalMessageSection.jsx";
import CoverLetterSection from "../CoverLetterSection/CoverLetterSection.jsx";

export default function AdditionalDocSection({resume, jobDescription, jobTitle, jobCompany, deployment}) {
    
    return (
        <div id="additional-docs" className="section-heading">
            <h2>Additional Documents</h2>
            <p>
                Please note, you <strong>MUST NOT</strong> use this generated document directly. It has been generated based on your resume and job description via a Generative AI and it bound to have a lot of issues and will lack the personal touch of a human. Recruiters and Hiring Managers are capable of easily identifying AI generated documents.
                <br/>
                Instead, use it as a starting point for your own document. There will be some suggestions on how to start to improve this generated document. Use them as your guide to make them your own.
            </p>
            <CoverLetterSection
                resume={resume}
                jobDescription={jobDescription}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                deployment={deployment}
            />
            <AdditionalMessageSection
                resume={resume}
                jobDescription={jobDescription}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                deployment={deployment}
            />
        </div>
    );
}
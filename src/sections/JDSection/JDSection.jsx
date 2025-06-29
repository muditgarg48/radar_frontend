import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setJobDescription, setJobDetails, resetJobData } from "../../store/features/jobSlice.js";
import { resetCompanyData, setCompanyName } from "../../store/features/companySlice.js";
import { setProcessingJobDescription } from "../../store/features/sessionSlice.js";
import { setResumeAlignmentScore } from "../../store/features/resumeSlice.js";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import './JDSection.css';
import JobDetailsSection from "../JobDetailsSection/JobDetailsSection.jsx";
import CompanyDetailsSection from "../CompanyDetailsSection/CompanyDetailsSection.jsx";
import AdditionalDocSection from "../AdditionalDocSection/AdditionalDocSection.jsx";

// export default function JDSection({deployment, setJobDescription, jobDescription, setJobTitle, setJobCompany, jobCompany, jobTitle, resume}) {
export default function JDSection() {

    const dispatch = useDispatch();
    const { deployment } = useSelector((state) => state.session);
    const { resumeText } = useSelector((state) => state.resume);
    const { jobDescription, jobTitle } = useSelector((state) => state.job);
    const { companyName } = useSelector((state) => state.company);

    // const [jobKeywords, setJobKeywords] = useState(null);
    // const [jobKeyNotes, setJobKeyNotes] = useState(null);
    const [jdCache, setJDCache] = useState("");
    // const [resumeText, setResumeText] = useState(null);
    // const [alignmentScore, setAlignmentScore] = useState(null);
    // const { jdKeywords, jdKeyNotes } = useSelector((state) => state.job);
    // const { resumeText, resumeAlignmentScore } = useSelector((state) => state.resume);

    // const [salaryBracket, setSalaryBracket] = useState(null);
    // const [experienceLevel, setExperienceLevel] = useState(null);
    // const [teamName, setTeamName] = useState(null);
    // const [sponsorship, setSponsorship] = useState(null);
    // const [location, setLocation] = useState(null);
    // const [benefits, setBenefits] = useState(null);
    // const { salaryBracket, experienceLevel, teamName, sponsorship, location, benefits } = useSelector((state) => state.job);

    // const [loading, setLoading] = useState(false);
    // const [highlightKeywords, setHighlightKeywords] = useState(false);
    // const { processingJobDescription } = useSelector((state) => state.session);
    // const { presentKeywords } = useSelector((state) => state.job);

    const handleJobDescriptionSubmit = async () => {

        if (jdCache === "") {
            alert("Please enter a job description.");
            return;
        }

        // setLoading(true);
        // setAlignmentScore(null);
        // setJobKeywords(null);
        // setJobKeyNotes(null);
        // setJobCompany(null);
        // setJobTitle(null);
        // setJobDescription(jdCache);
        dispatch(setProcessingJobDescription(true));
        dispatch(resetJobData());
        dispatch(resetCompanyData())
        dispatch(setJobDescription(jdCache));

        // if (resumeFile) {
        //     const formData = new FormData();
        //     formData.append('resume', resumeFile);
        //     const response = await fetch(deployment+"/get-resume-text", {
        //         method: "POST",
        //         body: formData,
        //     });
        //     if (response.ok) {
        //         // setHighlightKeywords(true);
        //         const result = await response.text();
        //         // setResumeText(result);
        //         dispatch(setResumeText(result));
        //     } else {
        //         alert("Failed to parse resume text.");
        //     }
        // }

        const response = await fetch(deployment+"/process-job-description", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "jd": jdCache}),
        });

        if (response.ok) {
            const result = await response.json();
            // setJobTitle(result.title);
            // setJobCompany(result.company);
            // setJobKeywords(result.keywords);
            // setJobKeyNotes(result.notes);
            // if ("salary_bracket" in result) setSalaryBracket(result.salary_bracket);
            // if ("experience_level" in result) setExperienceLevel(result.experience_level);
            // if ("visa_sponsorship" in result) setSponsorship(result.visa_sponsorship);
            // if ("location" in result) setLocation(result.location);
            // if ("benefits" in result) setBenefits(result.benefits);
            // if ("team_name" in result) setTeamName(result.team_name);
            dispatch(setCompanyName(result.company));
            dispatch(setJobDetails(result));
        } else {
            alert("Failed to process job description. "+result.error);
            // setLoading(false);
            // dispatch(setProcessingJobDescription(false));
        }

        if (resumeText) {
            const formData = new FormData();
            formData.append('resume', resumeText);
            formData.append('jd', jdCache);
            // formData.append('company', jobCompany);
            formData.append('company', companyName);
            formData.append('position', jobTitle);
            const response = await fetch(deployment+"/get-resume-alignment-score", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                // setAlignmentScore(result.alignment_score);
                dispatch(setResumeAlignmentScore(result.alignment_score));
            } else {
                alert("Failed to get resume alignment score. "+response.text().error);
                // setLoading(false);
                // dispatch(setProcessingJobDescription(false));
            }
        }

        // setLoading(false);
        dispatch(setProcessingJobDescription(false));
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
    
    return (
        <div id="jd-section">
            <h2 className="section-heading">Job Description</h2>
            <InputJD/>
            &nbsp;
            <button onClick={handleJobDescriptionSubmit}>Process Job Description</button>
            &nbsp;
            {jobDescription && <Tabs>
                <TabList>
                    <Tab>Job Details</Tab>
                    <Tab>Company Details</Tab>
                    <Tab>Additional Documents</Tab>
                </TabList>
                <TabPanel>
                    <JobDetailsSection
                        // loading={loading}
                        // deployment={deployment}
                        // jobTitle={jobTitle}
                        // jobCompany={jobCompany}
                        // jobDescription={jobDescription}
                        // resume={resume}
                        // resumeText={resumeText}
                        // alignmentScore={alignmentScore}
                        // jobKeywords={jobKeywords}
                        // highlightKeywords={highlightKeywords}
                        // jobKeyNotes={jobKeyNotes}
                        // benefits={benefits}
                        // sponsorship={sponsorship}
                        // experienceLevel={experienceLevel}
                        // salaryBracket={salaryBracket}
                        // teamName={teamName}
                        // location={location}
                    />
                </TabPanel>
                <TabPanel>
                    <CompanyDetailsSection
                        // deployment={deployment}
                        // jobTitle={jobTitle}
                        // jobCompany={jobCompany}
                    />
                </TabPanel>
                <TabPanel>
                    <AdditionalDocSection 
                        // resume={resume}
                        // jobDescription={jobDescription}
                        // jobTitle={jobTitle}
                        // jobCompany={jobCompany}
                        // deployment={deployment}
                    />
                </TabPanel>
            </Tabs>}
        </div>
    );
}
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setJobDescription, setJobDetails, resetJobData } from "../../store/features/jobSlice.js";
import { resetCompanyData, setCompanyName } from "../../store/features/companySlice.js";
import { statusOnline, setApplicationHistory, setProcessingJobDescription } from "../../store/features/sessionSlice.js";
import { setResumeAlignmentScore } from "../../store/features/resumeSlice.js";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './JDSection.css';
import JobDetailsSection from "../JobDetailsSection/JobDetailsSection.jsx";
import CompanyDetailsSection from "../CompanyDetailsSection/CompanyDetailsSection.jsx";
import AdditionalDocSection from "../AdditionalDocSection/AdditionalDocSection.jsx";
import serverOnline from "../../tools/serverOnline.jsx";
import { resetAllAdditionalDocs } from "../../store/features/additionalDocsSlice.js";

export default function JDSection() {

    const dispatch = useDispatch();
    const { serverStatus, deployment, applicationHistory } = useSelector((state) => state.session);
    const { resumeName, resumeText } = useSelector((state) => state.resume);
    const { jobDescription, jobTitle } = useSelector((state) => state.job);
    const { companyName } = useSelector((state) => state.company);

    const [jdCache, setJDCache] = useState(jobDescription? jobDescription : "");

    const addToApplicationHistory = (data) => { 
        let history = localStorage.getItem("RADAR_HISTORY");
        if (history === null) {
            history = [];
        } else {
            history = JSON.parse(history);
        }
        const newId = history.length;
        const newApplication = {
            id: newId,
            timeline: [
                {
                    status: 'not_applied',
                    timestamp: Date.now()
                }
            ],
            timestamp: Date.now(),
            resumeName: resumeName? resumeName : "NONE",
            jd: jdCache,
            status: 'not_applied',
            ...data
        };
        history.push(newApplication);
        localStorage.setItem("RADAR_HISTORY", JSON.stringify(history));
        dispatch(setApplicationHistory(history));
    };

    const handleJobDescriptionSubmit = async () => {

        if (jdCache === "") {
            alert("Please enter a job description.");
            return;
        }
        if (!serverOnline()) return;

        dispatch(setProcessingJobDescription(true));
        dispatch(resetJobData());
        dispatch(resetCompanyData());
        dispatch(resetAllAdditionalDocs());
        dispatch(setJobDescription(jdCache));

        const response = await fetch(deployment+"/process-job-description", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "jd": jdCache}),
        });

        if (response.ok) {
            const result = await response.json();
            dispatch(setCompanyName(result.company));
            dispatch(setJobDetails(result));
            addToApplicationHistory(result);
            if (applicationHistory.length < 3)
                alert("Make sure to set the correct status in the Application history table.");
        } else {
            alert("Failed to process job description. "+result.error);
        }

        if (resumeText) {
            const formData = new FormData();
            formData.append('resume', resumeText);
            formData.append('jd', jdCache);
            formData.append('company', companyName);
            formData.append('position', jobTitle);
            const response = await fetch(deployment+"/get-resume-alignment-score", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                dispatch(setResumeAlignmentScore(result.alignment_score));
            } else {
                alert("Failed to get resume alignment score. "+response.text().error);
            }
        }

        dispatch(setProcessingJobDescription(false));
    };

    const InputJD = () => {
        return (
            <textarea
                disabled={!serverOnline()}
                id="jd-input"
                rows={20}
                value={jdCache}
                onChange={(e) => setJDCache(e.target.value)}
                placeholder= {
                    serverStatus!==statusOnline?
                    serverStatus:
                    "Enter your job description here..."}
                wrap="soft"
            />
        );
    };
    
    return (
        <div id="jd-section">
            <h2 className="section-heading">JOB DESCRIPTION</h2>
            <div className="section-description">
                Understanding the job description is very important for any job seeker to ensure that their efforts are in the right direction. Job descriptions often hide critical requirements between the lines.
                This section will help you:
                <ul className="section-use-cases">
                    <li>
                        Filter out all the necessary information you need to know about the role without reading the entire job description.
                    </li>
                    <li>
                        Pinpoint must-have keywords to include in your resume and application for maximum ATS score and success rate.
                    </li>
                </ul>
            </div>
            <InputJD/>
            &nbsp;
            <button
                disabled={!serverOnline()}
                id="jd-process-button"
                onClick={handleJobDescriptionSubmit}>
                Process Job Description
            </button>
            &nbsp;
            {jobDescription && <Tabs>
                <TabList>
                    <Tab>Job Details</Tab>
                    <Tab disabled={companyName === "UNSPECIFIED"}>Company Details</Tab>
                    <Tab>Additional Documents</Tab>
                </TabList>
                <TabPanel>
                    <JobDetailsSection/>
                </TabPanel>
                <TabPanel>
                    <CompanyDetailsSection/>
                </TabPanel>
                <TabPanel>
                    <AdditionalDocSection/>
                </TabPanel>
            </Tabs>}
        </div>
    );
}
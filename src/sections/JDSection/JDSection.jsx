import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import './JDSection.css';
import JobDetailsSection from "../JobDetailsSection/JobDetailsSection.jsx";
import CompanyDetailsSection from "../CompanyDetailsSection/CompanyDetailsSection.jsx";
import AdditionalDocSection from "../AdditionalDocSection/AdditionalDocSection.jsx";

export default function JDSection({deployment, setJobDescription, jobDescription, setJobTitle, setJobCompany, jobCompany, jobTitle, resume}) {

    const [jobKeywords, setJobKeywords] = useState(null);
    const [jobKeyNotes, setJobKeyNotes] = useState(null);
    const [jdCache, setJDCache] = useState("");
    const [resumeText, setResumeText] = useState(null);
    const [alignmentScore, setAlignmentScore] = useState(null);

    const [salaryBracket, setSalaryBracket] = useState(null);
    const [experienceLevel, setExperienceLevel] = useState(null);
    const [teamName, setTeamName] = useState(null);
    const [sponsorship, setSponsorship] = useState(null);
    const [location, setLocation] = useState(null);
    const [benefits, setBenefits] = useState(null);

    const [loading, setLoading] = useState(false);
    const [highlightKeywords, setHighlightKeywords] = useState(false);

    const handleJobDescriptionSubmit = async () => {

        if (jdCache === "") {
            alert("Please enter a job description.");
            return;
        }

        setLoading(true);
        setAlignmentScore(null);
        setJobKeywords(null);
        setJobKeyNotes(null);
        setJobCompany(null);
        setJobTitle(null);
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
            if ("salary_bracket" in result) setSalaryBracket(result.salary_bracket);
            if ("experience_level" in result) setExperienceLevel(result.experience_level);
            if ("visa_sponsorship" in result) setSponsorship(result.visa_sponsorship);
            if ("location" in result) setLocation(result.location);
            if ("benefits" in result) setBenefits(result.benefits);
            if ("team_name" in result) setTeamName(result.team_name);
        } else {
            alert("Failed to process job description. "+result.error);
            setLoading(false);
        }

        if (resume) {
            const formData = new FormData();
            formData.append('resume', resume);
            formData.append('jd', jdCache);
            formData.append('company', jobCompany);
            formData.append('position', jobTitle);
            const response = await fetch(deployment+"/get-resume-alignment-score", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                setAlignmentScore(result.alignment_score);
            } else {
                alert("Failed to get resume alignment score. "+response.text().error);
                setLoading(false);
            }
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
                        loading={loading}
                        deployment={deployment}
                        jobTitle={jobTitle}
                        jobCompany={jobCompany}
                        jobDescription={jobDescription}
                        resume={resume}
                        resumeText={resumeText}
                        alignmentScore={alignmentScore}
                        jobKeywords={jobKeywords}
                        highlightKeywords={highlightKeywords}
                        jobKeyNotes={jobKeyNotes}
                        benefits={benefits}
                        sponsorship={sponsorship}
                        experienceLevel={experienceLevel}
                        salaryBracket={salaryBracket}
                        teamName={teamName}
                        location={location}
                    />
                </TabPanel>
                <TabPanel>
                    <CompanyDetailsSection
                        deployment={deployment}
                        jobTitle={jobTitle}
                        jobCompany={jobCompany}
                    />
                </TabPanel>
                <TabPanel>
                    <AdditionalDocSection 
                        resume={resume}
                        jobDescription={jobDescription}
                        jobTitle={jobTitle}
                        jobCompany={jobCompany}
                        deployment={deployment}
                    />
                </TabPanel>
            </Tabs>}
        </div>
    );
}
import React, { useState } from "react";
import Loading from '../../components/Loading/Loading.jsx';
import CompanyValuesSection from "../CompanyValuesSection/CompanyValuesSection.jsx";
import './JDSection.css';
import levelfyiIcon from '../../assets/levelfyi.svg';
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo.jsx";

export default function JDSection({deployment, setJobDescription, jobDescription, setJobTitle, setJobCompany, jobCompany, jobTitle, resume}) {

    const [jobKeywords, setJobKeywords] = useState(null);
    const [jobKeyNotes, setJobKeyNotes] = useState(null);
    const [jdCache, setJDCache] = useState("");
    const [resumeText, setResumeText] = useState(null);
    const [alignmentScore, setAlignmentScore] = useState(null);
    const [showCompanyValues, setShowCompanyValues] = useState(false);

    const [salaryBracket, setSalaryBracket] = useState(null);
    const [experienceLevel, setExperienceLevel] = useState(null);
    const [teamName, setTeamName] = useState(null);
    const [sponsorship, setSponsorship] = useState(false);
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
        setShowCompanyValues(false);
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

    const handleImproveResume = async () => {
        
    }

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
            <div id="jd-header">
                <div id="jd-within-header-title">
                    <CompanyLogo deployment={deployment} jobCompany={jobCompany}/>
                    &nbsp;
                    &nbsp;
                    <div>
                        {jobTitle && <div id="jd-title">{jobTitle}</div>}
                        {jobCompany && <div id="jd-company">{jobCompany}</div   >}
                    </div>
                </div>
                <div id="jd-within-header-rest">
                    <ResumeAlignment/>
                    <CheckSalaries/>
                </div>
                {/* <div id="jd-within-header">
                </div>  */}
            </div>
        );
    }

    const JSubHeader = () => {
        if (!jobCompany) {return null;}
        return (
            <div id="jd-subheader">
                {teamName && <div id="jd-team-name">
                    <span>👥</span>
                    &nbsp;
                    &nbsp;
                    <span>{teamName}</span>
                </div>}
                {salaryBracket && <div id="jd-salary-bracket">
                    <span>🤑</span>
                    &nbsp;
                    &nbsp;
                    <span>{salaryBracket}</span>
                </div>}
                {experienceLevel && <div id="jd-experience-level">
                    <span>🏢</span>
                    &nbsp;
                    &nbsp;
                    <span>{experienceLevel}</span>
                </div>}
                {sponsorship && <div id="jd-sponsorship">
                    Visa Sponsorship: {sponsorship? "✅" : "❌"}
                </div>}
                {location && <div id="jd-location">
                    <span>📌</span>
                    &nbsp;
                    &nbsp;
                    <span>{location}</span>
                </div>}
            </div>
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
                {/* <b>Suggested keywords</b> to be included in the application: */}
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
                {highlightKeywords? <div className="section-footnote">
                    <span className="jd-keyword keyword-present">Green</span> indicate that the keyword was found in your resume.
                </div>: <div className="section-footnote">
                    {
                        resume?
                        <em><a href="#jd-section">Process JD</a> to highlight which keywords were found in your resume.</em>:
                        <em><a href="#introduction-section">Add resume</a> and process JD again to check which keywords were found in your resume.</em>
                    }
                </div>}
                &nbsp;
            </div>
        );
    }

    const JNotes = () => {
        if (!jobKeyNotes) {return null;}
        return (
            <div>
                {benefits && <div id="jd-benefits">
                    <h3>💪  Key Benefits</h3>
                    <ul>
                    {
                        benefits.map((benefit, index) => {
                            return (<li key={index}>{benefit}</li>)
                        })
                    }
                    </ul>
                </div>}
                <h3>📝  Note:</h3>
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

    const CompanyValues = () => {
        return (
            <div id="company-values-section">
                {showCompanyValues && <CompanyValuesSection
                    deployment={deployment}
                    jobTitle={jobTitle}
                    jobCompany={jobCompany}
                />}
                {jobCompany && <button
                    style={{margin: "1% 0"}}
                    onClick={() => setShowCompanyValues(!showCompanyValues)}
                    >
                        {showCompanyValues? "Hide":"Get"} Company Values
                </button>}
            </div>
        );
    }

    const ResumeAlignment = () => {
        if (!jobDescription || loading) {return null;}
        if (!resume) {
            return (
                <div className="section-footnote"><em>
                    <a href="#introduction-section">Add resume</a> and process the JD again to get resume alignment score.
                </em></div>
            );
        } else if (!alignmentScore) {
            return (
                <div className="section-footnote"><em>
                    <a href="#jd-section">Process JD</a> to get resume alignment score.
                </em></div>
            );
        }
        if (alignmentScore) {
            return (
                <div className="resume-alignment-score">
                    Alignment Score:
                    <b className={
                        alignmentScore >= 80? "A alignment-score":
                        alignmentScore < 80 && alignmentScore >= 60? "B alignment-score":
                        alignmentScore < 60 && alignmentScore >= 40? "C alignment-score":
                        alignmentScore < 40 && alignmentScore >= 20? "D alignment-score":
                        "F alignment-score"
                        }>
                        {alignmentScore}%
                    </b>
                </div>
            );
        }
    }

    const CheckSalaries = () => {
        return (
            <button id="check-salaries">
                <img src={levelfyiIcon} alt="Redirect to Levels.fyi" width="40px" height="40px"/>
                &nbsp;
                &nbsp;
                <a href="https://www.levels.fyi/" target="_blank" rel="noopener noreferrer">Check Salaries</a>
            </button>
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
            <CompanyValues/>
            <JSubHeader/>
            <JKeywords/>
            <JNotes/>
        </div>
    );
}
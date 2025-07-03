import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setResumeAlignmentScore } from "../../store/features/resumeSlice.js";
import geminiIcon from '../../assets/gemini.svg';

import "./JobDetailsSection.css";
import Loading from "../../components/Loading/Loading.jsx";
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo.jsx";

export default function JobDetailsSection () {

    const dispatch = useDispatch();
    const { deployment, processingJobDescription } = useSelector((state) => state.session);
    const { jobTitle, jobDescription, jdKeywords, jdKeyNotes, benefits, sponsorship, experienceLevel, salaryBracket, teamName, location } = useSelector((state) => state.job);
    const { companyName } = useSelector((state) => state.company);
    const { resumeText, resumeAlignmentScore } = useSelector((state) => state.resume);
    const [loadingResumeAlignmentScore, setLoadingResumeAlignmentScore] = useState(false);

    async function calculateResumeAlignmentScore () {
        setLoadingResumeAlignmentScore(true);
        const formData = new FormData();
        formData.append('resume', resumeText);
        formData.append('jd', jobDescription);
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
        setLoadingResumeAlignmentScore(false);
    }

    const ResumeAlignment = () => {
        if(loadingResumeAlignmentScore) {
            return (
                <div id="loading-resume-alignment-score">
                    <Loading loading={loadingResumeAlignmentScore} message="Calculating resume alignment score..."/>
                </div>
            );
        }
        if (!jobDescription || processingJobDescription) {return null;}
        if (!resumeText) {
            return (
                <div className="section-footnote"><em>
                    <a href="#resume-header">Add resume</a> to get resume alignment score.
                </em></div>
            );
        } else if (!resumeAlignmentScore) {
            return (
                <button id="calculate-resume-alignment-score"
                    style={{margin: "1% 0"}}
                    onClick={calculateResumeAlignmentScore}
                >
                    <img src={geminiIcon} alt="Calculate Resume Alignment Score" width="20px" height="25px"/>
                    &nbsp;
                    &nbsp;
                    <span>Calculate Resume Alignment Score</span>
                </button>
            );
        }
        if (resumeAlignmentScore) {
            return (
                <div id="resume-alignment-score">
                    Alignment Score:
                    <b className={
                        resumeAlignmentScore >= 80? "A alignment-score":
                        resumeAlignmentScore < 80 && resumeAlignmentScore >= 60? "B alignment-score":
                        resumeAlignmentScore < 60 && resumeAlignmentScore >= 40? "C alignment-score":
                        resumeAlignmentScore < 40 && resumeAlignmentScore >= 20? "D alignment-score":
                        "F alignment-score"
                        }>
                        {resumeAlignmentScore}%
                    </b>
                </div>
            );
        }
    }

    const JHeader = () => {
        if (!jobTitle || !companyName) {return null;}
        return (
            <div id="jd-header">
                <div id="jd-within-header-title">
                    <CompanyLogo/>
                    &nbsp;
                    &nbsp;
                    <div>
                        {jobTitle && <div id="jd-title">{jobTitle}</div>}
                        {companyName && <div id="jd-company">{companyName}</div>}
                    </div>
                </div>
                <ResumeAlignment/>
            </div>
        );
    }

    const JSubHeader = () => {
        if (!companyName) {return null;}
        let salaries = null;
        let experiences = null;
        let locations = null;
        if (salaryBracket) salaries = salaryBracket.split(";");
        if (experienceLevel) experiences = experienceLevel.split(";");
        if (location) locations = location.split(";");
        return (
            <div id="jd-subheader">
                {teamName && <div id="jd-team-name">
                    <span>👥</span>
                    &nbsp;
                    &nbsp;
                    <span>{teamName}</span>
                </div>}
                {salaries && <div id="jd-salary-bracket">
                    <span>🤑</span>
                    &nbsp;
                    &nbsp;
                    <div>
                        {salaries.map((salary, index) => {
                            return (
                                <div key={index}>
                                    {salary}
                                </div>
                            )
                        })}
                    </div>
                </div>}
                {experiences && <div id="jd-experience-level">
                    <span>🏢</span>
                    &nbsp;
                    &nbsp;
                    <div>
                        {experiences.map((experience, index) => {
                            return (
                                <div key={index}>
                                    {experience}
                                </div>
                            )
                        })}
                    </div>
                </div>}
                {sponsorship && <div id="jd-sponsorship">
                    Visa Sponsorship: {sponsorship? "✅" : "❌"}
                </div>}
                {locations && <div id="jd-location">
                    <span>📌</span>
                    &nbsp;
                    &nbsp;
                    <div>
                        {locations.map((location, index) => {
                            return (
                                <div key={index}>
                                    {location}
                                </div>
                            )
                        })}
                    </div>
                </div>}
            </div>
        );
    }

    function checkResumeForKeyword (word) {
        if (!resumeText) {return false;}
        return resumeText.toLowerCase().includes(word.toLowerCase());
    }

    const JKeywords = () => {
        if (!jdKeywords) {return null;}
        const hardSkills = jdKeywords["hard_skills"];
        const softSkills = jdKeywords["soft_skills"];
        const otherKeywords = jdKeywords["other_keywords"];
        return (
            <div>
                <div id="jd-keywords-section">
                    <div className="jd-keywords-subsection-heading">HARD SKILLS</div>
                    <ul id="jd-keywords-hard-skills">
                    {
                        hardSkills.map((word, index) => {
                            if (word.length == 0) {return null;}
                            return (
                                <li className={checkResumeForKeyword(word) ? "jd-keyword keyword-present" : "jd-keyword"} key={index}>
                                    {word}
                                </li>
                            )
                        })
                    }
                    </ul>
                    <div className="jd-keywords-subsection-heading">SOFT SKILLS</div>
                    <ul id="jd-keywords-soft-skills">
                    {
                        softSkills.map((word, index) => {
                            if (word.length == 0) {return null;}
                            return (
                                <li className={checkResumeForKeyword(word) ? "jd-keyword keyword-present" : "jd-keyword"} key={index}>
                                    {word}
                                </li>
                            )
                        })
                    }
                    </ul>
                    <div className="jd-keywords-subsection-heading">OTHER KEYWORDS</div>
                    <ul id="jd-keywords-others">
                    {
                        otherKeywords.map((word, index) => {
                            if (word.length == 0) {return null;}
                            return (
                                <li className={checkResumeForKeyword(word) ? "jd-keyword keyword-present" : "jd-keyword"} key={index}>
                                    {word}
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
                <div className="section-footnote">
                    {resumeText? 
                        <em><span className="jd-keyword keyword-present">Green</span> indicate that the keyword was found in your resume.</em>:
                        <em><a href="#resume-header">Add resume</a> to highlight which keywords are in your resume.</em>
                    }
                </div> 
                &nbsp;
            </div>
        );
    }

    const JNotes = () => {
        if (!jdKeyNotes) {return null;}
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
                    jdKeyNotes.map((note, index) => {
                        return (<li key={index}>{note}</li>)
                    })
                }
                </ul>
            </div>
        );
    }
    
    return (
        <div id="job-section">
            <Loading loading={processingJobDescription} message="Processing the Job Description"/>
            <JHeader/>
            <JSubHeader/>
            <JKeywords/>
            <JNotes/>
        </div>
    );
}
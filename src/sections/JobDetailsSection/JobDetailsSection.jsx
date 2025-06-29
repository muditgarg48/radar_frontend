import React, { use } from "react";
import { useSelector } from "react-redux";

import "./JobDetailsSection.css";
import Loading from "../../components/Loading/Loading.jsx";
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo.jsx";

export default function JobDetailsSection ({
        // loading, 
        // deployment,
        // jobTitle, 
        // jobCompany, 
        // jobDescription, 
        // resume,
        // resumeText,
        // alignmentScore,
        // jobKeywords, 
        // highlightKeywords, 
        // jobKeyNotes, 
        // benefits, 
        // sponsorship, 
        // experienceLevel, 
        // salaryBracket, 
        // teamName, 
        // location
    }) {

    const { processingJobDescription } = useSelector((state) => state.session);
    const { jobTitle, jobDescription, jdKeywords, jdKeyNotes, benefits, sponsorship, experienceLevel, salaryBracket, teamName, location } = useSelector((state) => state.job);
    const { companyName } = useSelector((state) => state.company);
    const { resumeFile, resumeText, resumeAlignmentScore } = useSelector((state) => state.resume);

    const ResumeAlignment = () => {
        if (!jobDescription || processingJobDescription) {return null;}
        if (!resumeFile) {
            return (
                <div className="section-footnote"><em>
                    <a href="#introduction-section">Add resume</a> and process the JD again to get resume alignment score.
                </em></div>
            );
        } else if (!resumeAlignmentScore) {
            return (
                <div className="section-footnote"><em>
                    <a href="#jd-section">Process JD</a> to get resume alignment score.
                </em></div>
            );
        }
        if (resumeAlignmentScore) {
            return (
                <div className="resume-alignment-score">
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
        // if (!highlightKeywords) {return false;}
        return resumeText.toLowerCase().includes(word.toLowerCase());
    }

    const JKeywords = () => {
        if (!jdKeywords) {return null;}
        return (
            <div>
                {/* <b>Suggested keywords</b> to be included in the application: */}
                <ul id="jd-keywords-section">
                {
                    jdKeywords.map((word, index) => {
                        return (
                            <li className={checkResumeForKeyword(word) ? "jd-keyword keyword-present" : "jd-keyword"} key={index}>
                                {word}
                            </li>
                        )
                    })
                }
                </ul>
                {resumeText? <div className="section-footnote">
                    <span className="jd-keyword keyword-present">Green</span> indicate that the keyword was found in your resume.
                </div>: <div className="section-footnote">
                    {
                        resumeFile?
                        <em><a href="#jd-section">Process JD</a> to highlight which keywords were found in your resume.</em>:
                        <em><a href="#introduction-section">Add resume</a> and process JD again to check which keywords were found in your resume.</em>
                    }
                </div>}
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
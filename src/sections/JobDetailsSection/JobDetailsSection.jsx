import React from "react";
import "./JobDetailsSection.css";
import Loading from "../../components/Loading/Loading.jsx";
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo.jsx";

export default function JobDetailsSection ({
        loading, 
        deployment,
        jobTitle, 
        jobCompany, 
        jobDescription, 
        resume,
        resumeText,
        alignmentScore,
        jobKeywords, 
        highlightKeywords, 
        jobKeyNotes, 
        benefits, 
        sponsorship, 
        experienceLevel, 
        salaryBracket, 
        teamName, 
        location
    }) {

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
                <ResumeAlignment/>
            </div>
        );
    }

    const JSubHeader = () => {
        if (!jobCompany) {return null;}
        const salaries = salaryBracket.split(";");
        const experiences = experienceLevel.split(";");
        const locations = location.split(";");
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
                {experienceLevel && <div id="jd-experience-level">
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
                {location && <div id="jd-location">
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
    
    return (
        <div id="job-section">
            <Loading loading={loading} message="Processing the Job Description"/>
            <JHeader/>
            <JSubHeader/>
            <JKeywords/>
            <JNotes/>
        </div>
    );
}
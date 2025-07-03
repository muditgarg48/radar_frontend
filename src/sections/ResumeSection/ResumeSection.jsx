import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setResumeName, setResumeText, setResumeUrl, setResumeSummary, setResumeImprovements, resetResumeData } from "../../store/features/resumeSlice.js";
import { setLoadingSummary, setLoadingResumeImprovements } from "../../store/features/sessionSlice.js";
import "./ResumeSection.css";
import serverOnline from '../../tools/serverOnline';
import Loading from '../../components/Loading/Loading.jsx';
import redirectIcon from '../../assets/redirect.gif';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Document, Page, pdfjs } from "react-pdf"; // For PDF viewer
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // PDF viewer styles
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function ResumeSection() {

    const dispatch = useDispatch();
    const { deployment } = useSelector((state) => state.session);
    const { resumeName, resumeText, resumeUrl, resumeSummary, resumeImprovements } = useSelector((state) => state.resume);
    const { jobTitle, jdKeywords } = useSelector((state) => state.job);

    const { loadingSummary, loadingResumeImprovements } = useSelector((state) => state.session);

    const handleResumeUpload = async (file) => {
        const fileUrl = URL.createObjectURL(file);
        dispatch(setResumeUrl(fileUrl));
        dispatch(setResumeName(file.name));
        const formData = new FormData();
        formData.append('resume', file);
        const response = await fetch(deployment+"/get-resume-text", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            const result = await response.text();
            dispatch(setResumeText(result));
        } else {
            alert("Failed to parse resume text.");
        }
    };

    const summarizeResume = async () => {
        dispatch(setLoadingSummary(true));
        const formData = new FormData();
        formData.append('resume', resumeText);
        const response = await fetch(deployment+"/summarize-resume", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            dispatch(setResumeSummary(result.summary));
        }
        dispatch(setLoadingSummary(false));
    };

    const improveResume = async () => {
        dispatch(setLoadingResumeImprovements(true));
        const formData = new FormData();
        formData.append('resume', resumeText);
        const response = await fetch(deployment+"/improve-resume", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            dispatch(setResumeImprovements(result.improvements));
        }
        dispatch(setLoadingResumeImprovements(false));
    };

    const showResume = () => {
        if (resumeUrl) {
            window.open(resumeUrl, "_blank");
        } else {
            alert("No resume found.");
        }
    };

    const uploadResume = () => {
        dispatch(resetResumeData());
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/pdf";
        fileInput.onchange = (e) => handleResumeUpload(e.target.files[0]);
        fileInput.click();
    }

    const updateResume = () => {
        if (window.confirm("Are you sure you want to update the resume? This will clear the current resume.")) {
            uploadResume();
        }
    };
    
    const ResumeUploadSection = () => {
        if(resumeUrl) {
            return (
                <div id="resume-header">
                    <div id="resume-subheader">
                        <button disabled={!serverOnline()} onClick={updateResume}>Update Resume</button>
                        &nbsp;
                        &nbsp;
                        <div id="resume-name">{resumeName}</div>
                    </div>
                    <button onClick={showResume} id="resume-redirect">
                        <img src={redirectIcon} alt="Redirect to your uploaded resume" width="30px"/>
                    </button>
                </div>
            );
        } else {
            return(
                <div id="resume-header">
                    <button disabled={!serverOnline()} onClick={uploadResume}>Upload Resume</button>
                </div>
            );
        }
    }

    const ResumePreview = () => {
        if (resumeUrl)  {
            return (
                <div id="resume-preview">
                    <Document file={resumeUrl} >
                        <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false}/>
                    </Document>
                </div>
            );
        } else {
            return null;
        }
    }

    function checkJDForKeyword (word) {
        if (!jdKeywords) {return false;}
        for (let i = 0; i < jdKeywords["hard_skills"].length; i++) {
            // console.log(jdKeywords["hard_skills"][i]);
            if (jdKeywords["hard_skills"][i].toLowerCase().includes(word.toLowerCase())) {
                return true;
            }
        }
        for (let i = 0; i < jdKeywords["soft_skills"].length; i++) {
            if (jdKeywords["soft_skills"][i].toLowerCase().includes(word.toLowerCase())) {
                return true;
            }
        }
        for (let i = 0; i < jdKeywords["other_keywords"].length; i++) {
            if (jdKeywords["other_keywords"][i].toLowerCase().includes(word.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    function checkJDTitle (idealRole) {
        if (!jobTitle) {return false;}
        return jobTitle.toLowerCase().includes(idealRole.toLowerCase());
    }

    const ResumeSummary = () => {
        if (resumeSummary) {
            const quantificationScore = (resumeSummary.number_of_quantified_bullet_points / (resumeSummary.number_of_quantified_bullet_points + resumeSummary.number_of_generic_bullet_points)) * 100;
            return (
                <div id="resume-summary">
                    <div id="resume-summary-heading">📝 SUMMARY</div>
                    <p>{resumeSummary.summary}</p>
                    <div id="resume-summary-subsection">
                        <div className="resume-summary-item">
                            <div className="resume-summary-item-title">Ideal Experience Level</div>
                            <div>{resumeSummary.experience_level}</div>
                        </div>
                        <div className="resume-summary-item">
                            <div className="resume-summary-item-title">Tone</div>
                            <div>{resumeSummary.resume_tone}</div>
                        </div>
                        <div className="resume-summary-item">
                            <div className="resume-summary-item-title">Quantification Score</div>
                            <div>{quantificationScore.toFixed(2)}%</div>
                        </div>
                        <div className="resume-summary-item">
                            <div className="resume-summary-item-title">Top Skills</div>
                            <ul id="resume-top-skills">
                                {resumeSummary.top_skills.split(";").map((top_skill, index) => (
                                    <li className={checkJDForKeyword(top_skill) ? "resume-top-skill keyword-present" : "resume-top-skill"} key={index}>{top_skill}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="resume-summary-item">
                            <div className="resume-summary-item-title">Ideal Roles</div>
                            <ul id="resume-ideal-roles">
                                {resumeSummary.ideal_roles.split(";").map((ideal_role, index) => (
                                    <li className={checkJDTitle(ideal_role) ? "resume-ideal-role keyword-present" : "resume-ideal-role"} key={index}>{ideal_role}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        } else if (loadingSummary) {
            return (
                <div id="resume-summary">
                    <Loading loading={loadingSummary} message="Summarizing resume..."/>
                </div>
            );
        } else {
            return (
                <button onClick={summarizeResume}>Summarize Resume</button>
            );
        }
    }

    const ResumeImprovements = () => {
        if (resumeImprovements) {
            return (
                <div id="resume-improvements">
                    <div id="resume-additions">
                        <div className="resume-improvement-heading">➕ ADDITIONS</div>
                        <ul>
                            {resumeImprovements.additions.split(";").map((addition, index) => (
                                <li className="resume-improvement" key={index}>{addition}</li>
                            ))}
                        </ul>
                    </div>
                    <div id="resume-modifications">
                        <div className="resume-improvement-heading">✏️ MODIFICATIONS</div>
                        <ul>
                            {resumeImprovements.modifications.split(";").map((modification, index) => (
                                <li className="resume-improvement" key={index}>{modification}</li>
                            ))}
                        </ul>
                    </div>
                    <div id="resume-removals">
                        <div className="resume-improvement-heading">➖ REMOVALS</div>
                        <ul>
                            {resumeImprovements.removals.split(";").map((removal, index) => (
                                <li className="resume-improvement" key={index}>{removal}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        } else if (loadingResumeImprovements) {
            return (
                <div id="resume-improvements">
                    <Loading loading={loadingResumeImprovements} message="Suggesting improvements..."/>
                </div>
            );
        } else {
            return (
                <button onClick={improveResume}>Suggest Improvements</button>
            );
        }
    }

    return (
        <div style={{minHeight: "30vh"}}>
            <h2 className="section-heading">RESUME SECTION</h2>
            <div className="section-description">
                Your resume is your first impression in a competitive job market.
                This section helps you: 
                <ul className="section-use-cases">
                    <li>
                        Extracting key insights about the candidate from the document.
                    </li>
                    <li>
                        Identifying key shortcomings of the resume and providing suggestions for improvement.
                    </li>
                </ul>
            </div>
            <div className="section-note">
                <div className="section-subsection-heading">NOTE</div>
                <em>
                    The contents of the resume are never stored for 100% data privacy. 
                </em>
            </div>
            <div id="resume-section">
                <div id="resume-upload-section">
                    <ResumePreview />
                    <ResumeUploadSection />
                </div>
                {resumeUrl && <div id="resume-operations-section">
                    <Tabs>
                        <TabList>
                            <Tab>Summary</Tab>
                            <Tab>Improvements</Tab>
                        </TabList>
                        <TabPanel>
                            <ResumeSummary/>
                        </TabPanel>
                        <TabPanel>
                            <ResumeImprovements/> 
                        </TabPanel>
                    </Tabs>
                </div>}
            </div>
        </div>
    );
}
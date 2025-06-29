import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setResumeName, setResumeText, setResumeUrl, setResumeSummary, setResumeImprovements, resetResumeData } from "../../store/features/resumeSlice.js";
import { setLoadingSummary, setLoadingResumeImprovements } from "../../store/features/sessionSlice.js";
import "./ResumeSection.css";
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
                        <button onClick={updateResume}>Update Resume</button>
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
                    <button onClick={uploadResume}>Upload Resume</button>
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

    const ResumeSummary = () => {
        if (resumeSummary) {
            return (
                <div id="resume-summary">
                    <div id="resume-summary-heading">📝 SUMMARY</div>
                    <p>{resumeSummary}</p>
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
                    <div id="resume-deletions">
                        <div className="resume-improvement-heading">➖ DELETIONS</div>
                        <ul>
                            {resumeImprovements.deletions.split(";").map((deletion, index) => (
                                <li className="resume-improvement" key={index}>{deletion}</li>
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
            &nbsp;
            <div id="resume-section">
                <div id="resume-upload-section">
                    <ResumePreview />
                    <ResumeUploadSection />
                </div>
                &nbsp;
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
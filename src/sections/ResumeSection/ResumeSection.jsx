import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setResumeText, setResumeUrl, setResumeSummary, setResumeImprovements, resetResumeData } from "../../store/features/resumeSlice.js";
import { setLoadingSummary, setLoadingResumeImprovements } from "../../store/features/sessionSlice.js";
import "./ResumeSection.css";
import Loading from '../../components/Loading/Loading.jsx';

import { Document, Page, pdfjs } from "react-pdf"; // For PDF viewer
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // PDF viewer styles
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function ResumeSection() {

    const dispatch = useDispatch();
    const { deployment } = useSelector((state) => state.session);
    const { resumeText, resumeUrl, resumeSummary, resumeImprovements } = useSelector((state) => state.resume);

    const { loadingSummary, loadingResumeImprovements } = useSelector((state) => state.session);

    const handleResumeUpload = async (file) => {
        const fileUrl = URL.createObjectURL(file);
        dispatch(setResumeUrl(fileUrl));
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

    const updateResume = () => {
        if (window.confirm("Are you sure you want to update the resume? This will clear the current resume.")) {
            dispatch(resetResumeData())
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "application/pdf";
            fileInput.onchange = (e) => handleResumeUpload(e.target.files[0]);
            fileInput.click();
        }
    };
    
    const ResumeUploadSection = () => {
        return (
            <div id="resume-basic-actions">
                {
                    resumeUrl ?
                    <div>
                        <button onClick={updateResume}>Update Resume</button>
                        <button onClick={showResume}>Show Resume</button>
                    </div>:
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleResumeUpload(e.target.files[0])}
                    />
                }
            </div>
        );
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
        if(!resumeSummary && !loadingSummary) {return null}
        return (
            <div id="resume-summary">
                <h3>Resume Summary</h3>
                {
                    resumeSummary?
                        <p>{resumeSummary}</p>:
                        <Loading loading={loadingSummary} message="Summarizing resume..."/>
                }
            </div>
        );
    }

    const ResumeImprovements = () => {
        return (
            <div id="resume-improvements">
                {(resumeImprovements || loadingResumeImprovements) && <h3 style={{textAlign: "center"}}>Resume Improvements</h3>}
                {
                    resumeImprovements?
                    <ul>
                        {resumeImprovements.map((improvement, index) => (
                            <li className="resume-improvement" key={index}>{improvement}</li>
                        ))}
                    </ul>:
                    <Loading loading={loadingResumeImprovements} message="Suggesting improvements..."/>
                }
            </div>
        );
    }

    const ResumeActionButtons = () => {
        if (resumeUrl) { 
            return (
                <div id="resume-action-buttons">
                    <button onClick={summarizeResume}>Summarize Resume</button>        
                    <button onClick={improveResume}>Suggest Improvements</button>
                </div>
            );
        } else {
            return null;
        }
    }

    return (
        <div id="resume-section">
            <div id="resume-upload-section">
                <ResumeUploadSection />
                <ResumeSummary />
                <ResumePreview />
            </div>
            &nbsp;
            <div id="resume-operations-section">
                <ResumeActionButtons />
                <ResumeImprovements />
            </div>
        </div>
    );
}
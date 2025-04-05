import React, { useState } from "react";
import "./ResumeSection.css";
import Loading from '../components/Loading/Loading.jsx';
import { Document, Page, pdfjs } from "react-pdf"; // For PDF viewer
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // PDF viewer styles
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function ResumeSection({deployment, setResume, resume, setResumeUrl, resumeUrl}) {

    const [summary, setSummary] = useState("");
    const [improvements, setImprovements] = useState(null);

    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Handle resume upload
    const handleResumeUpload = async (file) => {
        // Store resume in localStorage
        const fileUrl = URL.createObjectURL(file);
        localStorage.setItem("resume", file.name);
        localStorage.setItem("resumeUrl", fileUrl);
        setResume(file);
        setResumeUrl(fileUrl);
    };

    // Summarize resume
    const summarizeResume = async () => {
        
        setLoadingSummary(true);
        const formData = new FormData();
        formData.append('resume', resume);
        // console.log(formData);
        const response = await fetch(deployment+"/summarize-resume", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            setSummary(result.summary);
        }
        setLoadingSummary(false);

    };

    // Generate resume improvement suggestions
    const improveResume = async () => {
        
        setLoadingSuggestions(true);
        const formData = new FormData();
        formData.append('resume', resume);
        const response = await fetch(deployment+"/improve-resume", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            setImprovements(result.improvements);
        }
        setLoadingSuggestions(false);
    };

    // Show resume in new tab
    const showResume = () => {
        if (resumeUrl) {
            window.open(resumeUrl, "_blank");
        } else {
            alert("No resume found in cache.");
        }
    };

    // Update resume
    const updateResume = () => {
        if (window.confirm("Are you sure you want to update the resume? This will clear the current resume.")) {
            localStorage.removeItem("resume");
            localStorage.removeItem("resumeUrl");
            // localStorage.removeItem("resume-embeddings");
            setResume(null);
            setResumeUrl(null);

            // IMPORTANT: remember to delete the file from gemini as well if uploaded

            // setEmbeddingsGenerated(false);

            // Prompt to upload new resume
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "application/pdf";
            fileInput.onchange = (e) => handleResumeUpload(e.target.files[0]);
            fileInput.click();
        }
    };
    
    const ResumeUploadSection = () => {
        return (
            <div id="resume-upload-button">
                {
                    resumeUrl ?
                    <button onClick={updateResume}>Update Resume</button> :
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
        if (summary) {
            return (
                <div id="resume-summary">
                    <h3>Resume Summary</h3>
                    <p>{summary}</p>
                </div>
            );
        } else {
            return (
                <div id="resume-summary">
                    <Loading loading={loadingSummary} message="Summarizing resume..."/>
                </div>
            );
        }
    }

    const ResumeImprovements = () => {
        if (improvements) {
            return (
                <div>
                    <h3>Resume Improvements</h3>
                    <ul id="resume-improvements">
                        {improvements.map((improvement, index) => (
                            <li class="resume-improvement" key={index}>{improvement}</li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return (
                <div>
                    <Loading loading={loadingSuggestions} message="Suggesting improvements..."/>
                </div>
            );
        }
    }

    const ResumeActionButtons = () => {
        if (resumeUrl) { 
            return (
                <div id="resume-action-buttons">
                    <button onClick={showResume}>Show Resume</button>
                    <button onClick={summarizeResume}>Summarize Resume</button>        
                    {/* <button onClick={updateResume}>Update Resume</button> */}
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
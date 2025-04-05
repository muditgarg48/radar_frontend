import React, { useState } from "react";
import Loading from '../components/Loading/Loading.jsx';
import './JDSection.css';

export default function JDSection({deployment, setJobDescription, jobDescription, setJobTitle, setJobCompany, jobCompany, jobTitle}) {
    
    const [jobKeywords, setJobKeywords] = useState(null);
    const [jobKeyNotes, setJobKeyNotes] = useState(null);
    const [jdCache, setJDCache] = useState("");

    const [loading, setLoading] = useState(false);

    // const handleJDChange = useCallback((event) => {
    //     setJDCache(event.target.value);
    // });

    // Handle job description input
    const handleJobDescriptionSubmit = async () => {

        if (jdCache === "") {
            alert("Please enter a job description.");
            return;
        }

        setLoading(true);
        setJobDescription(jdCache);

        const response = await fetch(deployment+"/process-job-description", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "jd": jdCache}),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(jdCache);
            console.log("Job Description Processed:", result);
            setJobTitle(result.title);
            setJobCompany(result.company);
            setJobKeywords(result.keywords);
            setJobKeyNotes(result.notes);
        }

        // setJDCache("");
        setLoading(false);
    };

    // const InputJD = React.memo(({ value, onChange }) => {
    //     return (
    //         <textarea
    //             id="jd-input"
    //             rows={20}
    //             value={value}
    //             onChange={onChange}
    //             placeholder="Paste job description here..."
    //             wrap="soft"
    //         />
    //     );
    // });

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
            <p>
                <b>Job Details:</b>
                <br/>
                {jobTitle && <span>{jobTitle}</span>} at {jobCompany && <span>{jobCompany}</span>} 
            </p>
        );
    }

    const JKeywords = () => {
        if (!jobKeywords) {return null;}
        return (
            <div>
                <b>Suggested keywords</b> to be included in the application:
                <ul id="jd-keywords-section">
                {
                    jobKeywords.map((word, index) => {
                        return (<li class="jd-keyword" key={index}>{word}</li>)
                    })
                }
                </ul>
            </div>
        );
    }

    const JNotes = () => {
        if (!jobKeyNotes) {return null;}
        return (
            <div>
                <u>Note:</u>
                <ul>
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
        <JKeywords/>
        <JNotes/>
      </div>
    );
}
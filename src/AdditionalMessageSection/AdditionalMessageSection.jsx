import React, { useState } from "react";
import Loading from '../components/Loading/Loading.jsx';
import './AdditionalMessageSection.css';

export default function AdditionalMessageSection({resume, jobDescription, jobTitle, jobCompany, deployment}) {
    
    const [additionalMessage, setAdditionalMessage] = useState(null);
    const [additionalMessageImprovements, setAdditionalMessageImprovements] = useState(null);
    const [additionalMessageContext, setAdditionalMessageContext] = useState(null);

    const [loadingAdditionalMessage, setLoadingAdditionalMessage] = useState(false);

    const handleAdditionalMsgGeneration = async () => {
        
        setAdditionalMessage(null);
        setAdditionalMessageImprovements(null);

        if (resume === null) {
            alert("Please upload a resume first.");
            return;
        } else if (jobDescription === "") {
            alert("Please enter a job description and process it first.");
            return;
        } else if (jobTitle === ""  || jobCompany === "") {
            alert("Please process the job description first");
            return;
        }
        
        setLoadingAdditionalMessage(true);
        
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('jd', jobDescription);
        formData.append('position', jobTitle);
        formData.append('company', jobCompany);
        formData.append('context', additionalMessageContext);

        const response = await fetch(deployment+"/generate-additional-msg", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Additional message generated:", result.additional_msg);
            setAdditionalMessage(result.additional_msg);
            setAdditionalMessageImprovements(result.improvements);
        } else {
            console.log("Error generating additional message");
            console.log(response.json().then(data => console.log(data.error)));
        }

        setLoadingAdditionalMessage(false);
    }
    
    return (
        <div>
            <h3>Additional message with your application</h3>
            <div>
                <h4>Context (optional)</h4>
                <textarea
                    rows={5}
                    id="additional-msg-context" 
                    placeholder="Additional Message context" 
                    onChange={(e) => setAdditionalMessageContext(e.target.value)}
                />
            </div>
            &nbsp;
            <button id="gen-additional-msg" onClick={handleAdditionalMsgGeneration}>Generate Additional Message</button>
            &nbsp;
            <Loading 
                loading={loadingAdditionalMessage} 
                message="Generating Additional Message"
            />
            {additionalMessage && <div id="additional-msg">
                <p>{additionalMessage}</p>
            </div>}
            {additionalMessage && <p id="additional-msg-characters-count">
                    {additionalMessage.length} characters
            </p>}
            {additionalMessageImprovements && <div>
                <u>Improvements for final version:</u>
                <ul>
                    {additionalMessageImprovements.map((improvement, index) => {
                        return (<li key={index}>{improvement}</li>)
                    })}
                </ul>
            </div>}
        </div>
    );
}
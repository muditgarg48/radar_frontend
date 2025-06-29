import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoadingAdditionalMessage, setAdditionalMessageDetails, setAdditionalMessageContext, resetAdditionalMessage } from "../../store/features/additionalDocsSlice.js";
import Loading from '../../components/Loading/Loading.jsx';
import './AdditionalMessageSection.css';

export default function AdditionalMessageSection() {
    
    const dispatch = useDispatch();
    const { deployment } = useSelector((state) => state.session);
    const { resumeFile } = useSelector((state) => state.resume);
    const { jobDescription, jobTitle } = useSelector((state) => state.job);
    const { companyName } = useSelector((state) => state.company);

    const [addMsgContext, maintainAddMsgContext] = useState(null);

    const { additionalMessage, additionalMessageContext, additionalMessageImprovements, loadingAdditionalMessage } = useSelector((state) => state.additionalDocs);

    const handleAdditionalMsgGeneration = async () => {
        
        dispatch(resetAdditionalMessage());
        dispatch(setAdditionalMessageContext(addMsgContext));

        if (resumeFile === null) {
            alert("Please upload a resume first.");
            return;
        } else if (jobDescription === "") {
            alert("Please enter a job description and process it first.");
            return;
        } else if (jobTitle === ""  || companyName === "") {
            alert("Please process the job description first");
            return;
        }
        
        dispatch(setLoadingAdditionalMessage(true));
        
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
            dispatch(setAdditionalMessageDetails(result));
        } else {
            console.log("Error generating additional message");
            console.log(response.json().then(data => console.log(data.error)));
        }

        dispatch(setLoadingAdditionalMessage(false));
    }
    
    return (
        <div id="additional-msg-section">
            <h3>Additional message with your application</h3>
            <div>
                <h4>Context (optional)</h4>
                <textarea
                    rows={2}
                    id="additional-msg-context" 
                    placeholder="Additional Message context" 
                    onChange={(e) => maintainAddMsgContext(e.target.value)}
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
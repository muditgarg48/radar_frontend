import React, { useEffect, useState } from "react";
import './CompanyValuesSection.css';
import Loading from "../components/Loading/Loading";

export default function CompanyValuesSection({jobTitle, jobCompany, deployment}) {
    
    const [values, setValues] = useState(null);
    const [link, setLink] = useState(null);
    const [domain, setDomain] = useState(null);
    const [clientId, setClientId] = useState(null);

    const [loadingValues, setLoadingValues] = useState(true);

    useEffect(() => {
        const fetchValues = async () => {
            const response = await fetch(deployment+"/get-company-values", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"job_title": jobTitle, "company":jobCompany})
            });

            if (response.ok) {
                const result = await response.json();
                setValues(result.values);
                setLink(result.link);
                setDomain(result.domain);
                setLoadingValues(false);
            }
        }
        const fetchLogoClientId = async () => {
            const response = await fetch(deployment+"/get-logo-client-id", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.text();
                setClientId(result);
            }
        }
        fetchValues();
        fetchLogoClientId();
    }, [jobCompany]);

    return (
        <div id="company-values-section" className="section-container">
            <br/>
            <hr/>
            {loadingValues?
                <Loading loading={loadingValues} message="Fetching company values..."/>:
                <div>
                    <div id="company-values-redirect">
                        <img className="company-logo" src={`https://cdn.brandfetch.io/${domain}?c=${clientId}`} alt={jobCompany}/>
                        &nbsp;
                        &nbsp;
                        <h2>{jobCompany} Core Values</h2>
                        &nbsp;
                        <a href={link} target="_blank" rel="noopener noreferrer">🔗</a>
                    </div>
                    {
                        values.map((value, i) => (
                            <div key={i} className="company-value-item">
                                <div><strong>{value.value_name}</strong></div>
                                <div><em>{value.value_explanation}</em></div>
                                <ul>{
                                    value.value_usage_recommendations_in_interview.map((rec, j) => (<li key={j}>{rec}</li>))
                                }</ul>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
}
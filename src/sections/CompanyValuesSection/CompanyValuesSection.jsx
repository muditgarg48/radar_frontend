import React, { useEffect, useState } from "react";
import './CompanyValuesSection.css';
import Loading from "../../components/Loading/Loading";

import cachedRetriever from "../../tools/cachedRetriever";

export default function CompanyValuesSection({jobTitle, jobCompany, deployment}) {
    
    const [values, setValues] = useState(null);
    const [link, setLink] = useState(null); 

    const [loadingValues, setLoadingValues] = useState(true);

    useEffect(() => {
        const fetchValues = async () => {

            const company_values = await cachedRetriever(
                "RADAR_CACHED_COMPANY_VALUES",
                jobCompany.toLowerCase(),
                deployment,
                "/get-company-values",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"job_title": jobTitle, "company":jobCompany})
                }
            );
            setValues(company_values.values);
            setLink(company_values.link);
            setLoadingValues(false);
        }
        fetchValues();
    }, [jobCompany]);

    return (
        <div id="company-values" className="section-container">
            {loadingValues?
                <div style={{margin: "1% 0"}}>
                    <Loading loading={loadingValues} message="Fetching company values..."/>
                </div>:
                <div>
                    <div id="company-values-redirect">
                        <h2>Core Values</h2 >
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
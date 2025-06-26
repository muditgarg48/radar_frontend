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
                jobCompany,
                deployment,
                "/get-company-values",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"job_title": jobTitle, "company":jobCompany})
                }
            );
            // console.log(company_values);
            setValues(company_values.values);
            setLink(company_values.link);
            setLoadingValues(false);

            // let company_values = localStorage.getItem("RADAR_CACHED_COMPANY_VALUES");
            // if (company_values != null) {
            //     company_values = JSON.parse(company_values);
            //     if (jobCompany in company_values) {
            //         console.log("Using cached company values for "+jobCompany);
            //         setValues(company_values[jobCompany].values);
            //         setLink(company_values[jobCompany].link);
            //         setLoadingValues(false);
            //         return;
            //     }
            //     console.log("Couldn't find cached company values for "+jobCompany);
            // }

            // const response = await fetch(deployment+"/get-company-values", {
            //     method: "POST",
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({"job_title": jobTitle, "company":jobCompany})
            // });
            // if (response.ok) {
            //     const result = await response.json();
            //     let company_values = localStorage.getItem("RADAR_CACHED_COMPANY_VALUES");
            //     if (company_values == null) {
            //         company_values = {};
            //         console.log("The caching of company values is new.")
            //     } else {
            //         company_values = JSON.parse(company_values);
            //         console.log(company_values)
            //     }
            //     company_values[jobCompany] = result;
            //     localStorage.setItem("RADAR_CACHED_COMPANY_VALUES", JSON.stringify(company_values));
            //     console.log("Cached the company values for "+jobCompany);
            //     setValues(result.values);
            //     setLink(result.link);
            //     setLoadingValues(false);
            // }
        }
        fetchValues();
    }, [jobCompany]);

    return (
        <div id="company-values" className="section-container">
            {loadingValues?
                <Loading loading={loadingValues} message="Fetching company values..."/>:
                <div>
                    <div id="company-values-redirect">
                        <h2>Core Values</h2>
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
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFetchingCompanyValues } from "../../store/features/sessionSlice";
import { setValues, setCompanyValuesLink } from "../../store/features/companySlice";

import './CompanyValuesSection.css';
import Loading from "../../components/Loading/Loading";

import cachedRetriever from "../../tools/cachedRetriever";

export default function CompanyValuesSection() {
    
    const dispatch = useDispatch();
    // const [values, setValues] = useState(null);
    // const [link, setLink] = useState(null);
    const { jobTitle } = useSelector((state) => state.job);
    const { companyName, companyValues, companyValuesLink } = useSelector((state) => state.company);

    // const [loadingValues, setLoadingValues] = useState(true);
    const { fetchingCompanyValues } = useSelector((state) => state.session);

    useEffect(() => {
        const fetchValues = async () => {

            dispatch(setFetchingCompanyValues(true));
            const company_values = await cachedRetriever(
                "RADAR_CACHED_COMPANY_VALUES",
                companyName.toLowerCase(),
                "/get-company-values",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"job_title": jobTitle, "company": companyName})
                }
            );
            // console.log(company_values)
            dispatch(setValues(company_values.values));
            dispatch(setCompanyValuesLink(company_values.link));
            dispatch(setFetchingCompanyValues(false));
        }
        if (!companyValues) fetchValues();
    }, [companyName]);

    return (
        <div id="company-values" className="section-container">
            {fetchingCompanyValues?
                <div style={{margin: "1% 0"}}>
                    <Loading loading={fetchingCompanyValues} message="Fetching company values..."/>
                </div>:
                <div>
                    <div id="company-values-redirect">
                        <h2>Core Values</h2 >
                        <a href={companyValuesLink} target="_blank" rel="noopener noreferrer">🔗</a>
                    </div>
                    {
                        companyValues && companyValues.map((value, i) => (
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
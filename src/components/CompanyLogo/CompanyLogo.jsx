import React, {useEffect, useState} from "react";
import './CompanyLogo.css';

export default function CompanyLogo({deployment, jobCompany}) {
    
    const [clientId, setClientId] = useState(null);
    const [domain, setDomain] = useState(null);

    useEffect(() => {
        const fetchLogoClientId = async () => {
            const response = await fetch(deployment+"/get-logo-client-id", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.text();
                setClientId(result);
            }
        }
        const fetchCompanyDomain = async () => {
            // const response = await fetch(deployment+"/get-company-domain", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({"company": jobCompany}),
            // });

            // if (response.ok) {
            //     const result = await response.json();
            //     console.log(result);
            //     setDomain(result.domain);
            // }
            const result = await cachedRetriever(
                "RADAR_CACHED_COMPANY_DOMAINS",
                jobCompany.toLowerCase(),
                deployment,
                "/get-company-domain",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"company":jobCompany})
                }
            );
            setDomain(result.domain);
        }
        fetchLogoClientId();
        fetchCompanyDomain();
    }, []);

    return (
        clientId && domain &&
        <img className="company-logo" src={`https://cdn.brandfetch.io/${domain}?c=${clientId}`} alt={jobCompany}/>
    );
}
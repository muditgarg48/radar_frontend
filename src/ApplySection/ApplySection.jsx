import React, { useEffect, useState } from "react";
import "./ApplySection.css";

export default function ApplySection({deployment}) {
    const [applyData, setApplyData] = useState(null);
    const [clientId, setClientId] = useState(null);
    const logo_link = "https://cdn.brandfetch.io/";

    useEffect(() => {
        const fetchApplyData = async () => {
            const response = await fetch(deployment+"/get-apply-data", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.json();
                setApplyData(result);
            }
        };

        const fetchLogoClientId = async () => {
            const response = await fetch(deployment+"/get-logo-client-id", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.text();
                setClientId(result);
            }
        }

        fetchLogoClientId().then(() => fetchApplyData());
    }, [deployment]);

    if (!applyData) {
        return <div>Loading the list...</div>;
    }

    return (     
        <div id="apply-section">
            <h2>APPLY DIRECTLY THROUGH THEIR PORTAL</h2>
            <p>
                I felt by the time a role was advertised on universal job portals like LinkedIn or Glassdoor, it would be too late to apply. With the current job market, it has become very competitive and a little late is a little too late. Hence, I used to apply directly through each company's portal. The problem was that it was not a structured effort and I used to apply to any company that came to my mind and resonated with me. This section would hence help to improve this process.
            </p>
            <p>
                I had also tried to research to find out if there are any data endpoints or public APIs that I could leverage so that I could accumulate all jobs in a single place but unfortunately that wasn't possible. It struck me later that if that would have been possible, most universal job portals would have not been competing for the applicants' attention.
            </p>
            <p>
                In some cases, I too felt like going to these universal job portals. Hence I have included them at the end of this section as well.
            </p>
            <h4>Happy Applying!</h4>
            {applyData.map((item, index) => (
                <div className="apply-category" key={index}>
                    <h3 className="category-name">{item.category}</h3>
                    {/* <hr/> */}
                    <div className="company-list">
                        {item.data.map((company, i) => (
                            <a className="apply-button" key={i} href={company.portal_link} target="_blank" rel="noopener noreferrer">
                                <img className="company-logo" src={`${logo_link}${company.domain}?c=${clientId}`} alt={company.name}/>
                                <div className="company-name">{company.name}</div>
                            </a>
                        ))}
                    </div>
                </div>  
            ))}
        </div>
    );
}
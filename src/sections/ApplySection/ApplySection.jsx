import React, { useEffect, useState } from "react";
import "./ApplySection.css";

export default function ApplySection({deployment}) {

    const [applyData, setApplyData] = useState(null);
    const [clientId, setClientId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCompanies, setFilteredCompanies] = useState(applyData);
    const logo_link = "https://cdn.brandfetch.io/";

    useEffect(() => {
        const fetchApplyData = async () => {
            const response = await fetch(deployment+"/get-apply-data", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.json();
                setApplyData(result);
                setFilteredCompanies(result);
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

    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }

    const filterCompanies = (query) => {
        if (!applyData) {
            return;
        }
        query = query.toLowerCase();
        const filtered = applyData.map(category => {
            const filteredCompanies = category.data.filter(company => 
                company.name.toLowerCase().includes(query) ||
                company.portal_link.toLowerCase().includes(query) ||
                company.domain.toLowerCase().includes(query)
            );
            if (filteredCompanies.length > 0 || category.category.toLowerCase().includes(query)) {
                return {
                    ...category,
                    data: filteredCompanies.length > 0 ? filteredCompanies : category.data
                };
            }
            return null;
        }).filter(Boolean); // Remove null entries (categories with no matches)
        setFilteredCompanies(filtered);
    };

    useEffect(() => {
        filterCompanies(searchQuery);
    }, [searchQuery]);

    if (!applyData) {
        return <div>Loading the list...</div>;
    }

    function SingleCompany(company) {
        company = company.company
        return (
            <a className="apply-button" href={company.portal_link} target="_blank" rel="noopener noreferrer">
                <img className="company-logo" src={`${logo_link}${company.domain}?c=${clientId}`} alt={company.name}/>
                <div className="company-name">{company.name}</div>
            </a>
        );
    }

    function SingleCategory(category) {
        category = category.category;
        return (
            <div className="apply-category">
                <h2 className="category-name">{category.category}</h2>
                <div className="company-list">
                {
                    category.data.map((company, i) => (
                        <SingleCompany 
                            company={company} 
                            key={i}
                        />
                    ))
                }
                </div>
            </div>  
        );
    }

    function displayData(data) {
        return (
            data.map((item, index) => (
                <SingleCategory 
                    key={index} 
                    category={item} 
                />
            ))
        );
    }

    return (     
        <div id="apply-section">
            <h2 className="section-heading">APPLY DIRECTLY THROUGH THEIR PORTAL</h2>
            <p>
                I felt by the time a role was advertised on universal job portals like LinkedIn or Glassdoor, it would be too late to apply. With the current job market, it has become very competitive and a little late is a little too late. Hence, I used to apply directly through each company's portal. The problem was that it was not a structured effort and I used to apply to any company that came to my mind and resonated with me. This section would hence help to improve this process.
            </p>
            <p>
                I had also tried to research to find out if there are any data endpoints or public APIs that I could leverage so that I could accumulate all jobs in a single place but unfortunately that wasn't possible. It struck me later that if that would have been possible, most universal job portals would have not been competing for the applicants' attention.
            </p>
            <p>
                In some cases, I too felt like going to these universal job portals. Hence I have included them at the end of this section as well.
            </p>
            <h4>Please Note, there is no affiliation between RaDAR and any of these companies. These are just the direct links to the list of job opportunties there.</h4>
            <h3>Happy Applying!</h3>
            <input
                type="text"
                placeholder="Search company ..."
                value={searchQuery}
                onChange={handleSearchChange}
                id="search-company"
            />
            { searchQuery == "" ?
                displayData(applyData) :
                displayData(filteredCompanies)
            }
        </div>
    );
}
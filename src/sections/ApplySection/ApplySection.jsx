import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoadingApplyData, setLogoClientId } from "../../store/features/sessionSlice.js";
import "./ApplySection.css";
import Loading from "../../components/Loading/Loading.jsx";
import ErrorLogo from "../../components/ErrorLogo/ErrorLogo.jsx";

export default function ApplySection() {

    const dispatch = useDispatch();
    const { serverStatus, deployment, loadingApplyData, logoClientId } = useSelector((state) => state.session);

    const [applyData, setApplyData] = useState(null);
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
                dispatch(setLoadingApplyData(false));
            }
        };

        const fetchLogoClientId = async () => {
            const response = await fetch(deployment+"/get-logo-client-id", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.text();
                dispatch(setLogoClientId(result));
            }
        }

        if(!logoClientId) fetchLogoClientId().then(() => fetchApplyData());

    }, []);

    useEffect(() => {
        if (serverStatus === "🔴 Offline" || serverStatus === "🟢 Online") {
            dispatch(setLoadingApplyData(false));
        } else {
            dispatch(setLoadingApplyData(true));
        }
    }, [serverStatus]);

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
        }).filter(Boolean);
        setFilteredCompanies(filtered);
    };

    useEffect(() => {
        filterCompanies(searchQuery);
    }, [searchQuery]);

    function SingleCompany(company) {
        company = company.company
        return (
            <a className="apply-button" href={company.portal_link} target="_blank" rel="noopener noreferrer">
                <img className="company-logo" src={`${logo_link}${company.domain}?c=${logoClientId}`} alt={company.name}/>
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
            <p className="section-description">
                In today's hyper-competitive job market, timing is critical. By the time roles appear on mainstream platforms like LinkedIn or Glassdoor, they often receive hundreds of applications within hours. To help you stay ahead, this section provides direct links to company career portals, allowing you to apply before positions are widely advertised.
            </p>
            <p className="section-note">
                <div className="section-subsection-heading">NOTE</div>
                <em>
                    While researching, I explored whether any public APIs could centralize these opportunities. However, their lack explains why universal job boards remain dominant. They fill a gap that technical limitations create. For completeness, I've also included traditional platforms, but direct applications remain the gold standard for early access.
                </em>
            </p>
            <h3>GOOD LUCK!!</h3>
            <Loading loading={loadingApplyData} message="Loading the Portal List"/>
            {applyData && <>
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
            </>}
            {!applyData && !loadingApplyData && 
                <ErrorLogo
                    errorMessage="There's something wrong with the server."
                />
            }
        </div>
    );
}
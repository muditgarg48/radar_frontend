import React, {useState} from "react";
import "./CompanyDetailsSection.css";   
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo.jsx";
import CompanyValuesSection from "../CompanyValuesSection/CompanyValuesSection.jsx";
import levelfyiIcon from '../../assets/levelfyi.svg';
import glassdoorIcon from '../../assets/glassdoor.svg';
import geminiIcon from '../../assets/gemini.svg';

export default function CompanyDetailsSection ({jobTitle, jobCompany, deployment}) {
    
    const [showCompanyValues, setShowCompanyValues] = useState(false);

    const generateGlassdoorLink = () => {
        return "https://www.glassdoor.ie/Reviews/index.htm?filterType=RATING_OVERALL&employerName="+jobCompany.toLowerCase().replace(" ", "+")+"&page=1&overall_rating_low=1";
    }

    const CheckSalaries = () => {
        return (
            <a href="https://www.levels.fyi/" target="_blank" rel="noopener noreferrer">
                <button id="check-salaries">
                    <img src={levelfyiIcon} alt="Redirect to Levels.fyi" width="60px" height="35px"/>
                    Check Salaries
                </button>
            </a>
        );
    }

    const CheckCompany = () => {
        return (
            <a href={generateGlassdoorLink()} target="_blank" rel="noopener noreferrer">
                <button id="check-company">
                    <img src={glassdoorIcon} alt="Redirect to Glassdoor Review" width="20px" height="35px"/>
                    Glassdoor Review
                </button>
            </a>
        );
    }

    const GetCompanyValues = () => {
        return (
            <button id="get-company-values"
                style={{margin: "1% 0"}}
                onClick={() => setShowCompanyValues(!showCompanyValues)}
            >
                <img src={geminiIcon} alt="Redirect to Levels.fyi" width="30px" height="35px"/>
                {showCompanyValues? "Hide":"Get"} Company Values
            </button>
        );
    }

    const CompanyHeader = () => {
        if (!jobCompany) {return null;}
        return (
            <div id="company-section-header">
                <div id="company-section-header-title">
                    <CompanyLogo deployment={deployment} jobCompany={jobCompany}/>
                    &nbsp;
                    &nbsp;
                    <h2 id="jd-company">{jobCompany}</h2>
                </div>
                <div id="company-section-header-buttons">
                    <CheckSalaries/>
                    <CheckCompany/>
                    <GetCompanyValues/>
                </div>
            </div>
        );
    }
    
    return (
        <div id="company-section">
            <CompanyHeader/>
            {showCompanyValues && <CompanyValuesSection
                deployment={deployment}
                jobCompany={jobCompany}
                jobTitle={jobTitle}
            />}
        </div>
    );
}
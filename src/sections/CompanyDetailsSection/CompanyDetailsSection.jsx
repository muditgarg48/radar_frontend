import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setGlassdoorLink } from "../../store/features/companySlice.js";
import { showCompanyValues, hideCompanyValues } from "../../store/features/sessionSlice.js";

import "./CompanyDetailsSection.css";   
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo.jsx";
import CompanyValuesSection from "../CompanyValuesSection/CompanyValuesSection.jsx";
import levelfyiIcon from '../../assets/levelfyi.svg';
import glassdoorIcon from '../../assets/glassdoor.svg';
import geminiIcon from '../../assets/gemini.svg';

export default function CompanyDetailsSection () {
    
    const dispatch = useDispatch();
    const { companyName, companyGlassdoorLink } = useSelector((state) => state.company);
    const { companyValuesVisibility } = useSelector((state) => state.session);

    useEffect(()=> {
        if (companyName && !companyGlassdoorLink) {
            dispatch(setGlassdoorLink(
                "https://www.glassdoor.ie/Reviews/index.htm?filterType=RATING_OVERALL&employerName="+companyName.toLowerCase().replace(" ", "+")+"&page=1&overall_rating_low=1"
            ));
        }
    }, [])

    const CheckSalaries = () => {
        return (
            <a href="https://www.levels.fyi/" target="_blank" rel="noopener noreferrer">
                <button id="check-salaries" disabled={companyName === "UNSPECIFIED"}>
                    <img src={levelfyiIcon} alt="Redirect to Levels.fyi" width="60px" height="35px"/>
                    Check Salaries
                </button>
            </a>
        );
    }

    const CheckCompany = () => {
        return (
            <a href={companyGlassdoorLink} target="_blank" rel="noopener noreferrer">
                <button id="check-company" disabled={companyName === "UNSPECIFIED"}>
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
                onClick={() => {
                    if (companyValuesVisibility) {
                        dispatch(hideCompanyValues());
                    } else {
                        dispatch(showCompanyValues());
                    }
                }}
                disabled={companyName === "UNSPECIFIED"}
            >
                <img src={geminiIcon} alt="Fetch Company Values" width="30px" height="35px"/>
                {companyValuesVisibility? "Hide":"Get"} Company Values
            </button>
        );
    }

    const CompanyHeader = () => {
        if (!companyName) {return null;}
        return (
            <div id="company-section-header">
                <div id="company-section-header-title">
                    <CompanyLogo/>
                    &nbsp;
                    &nbsp;
                    <h2 id="jd-company">{companyName}</h2>
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
            {companyValuesVisibility && <CompanyValuesSection/>}
        </div>
    );
}
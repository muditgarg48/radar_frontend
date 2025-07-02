import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogoClientId } from "../../store/features/sessionSlice.js";
import { setDomain } from "../../store/features/companySlice.js";
import './CompanyLogo.css';
import cachedRetriever from "../../tools/cachedRetriever";

export default function CompanyLogo({company = null}) {

    const dispatch = useDispatch();
    const { deployment, logoClientId } = useSelector((state) => state.session);
    const { companyName, companyDomain } = useSelector((state) => state.company);

    const name = company? company: companyName;

    useEffect(() => {
        const fetchLogoClientId = async () => {
            const response = await fetch(deployment+"/get-logo-client-id", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.text();
                dispatch(setLogoClientId(result));
            }
        }
        const fetchCompanyDomain = async () => {
            const result = await cachedRetriever(
                "RADAR_CACHED_COMPANY_DOMAINS",
                name.toLowerCase(),
                "/get-company-domain",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"company": name})
                }
            );
            dispatch(setDomain(result.domain));
        }
        if (!logoClientId) fetchLogoClientId();
        if (!companyDomain) fetchCompanyDomain();
    }, []);

    if (name === "UNSPECIFIED") return null;

    return (
        logoClientId && companyDomain &&
        <img className="company-logo" src={`https://cdn.brandfetch.io/${companyDomain}?c=${logoClientId}`} alt={name}/>
    );
}
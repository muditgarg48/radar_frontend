import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogoClientId } from "../../store/features/sessionSlice.js";
import { setDomain } from "../../store/features/companySlice.js";
import './CompanyLogo.css';
import cachedRetriever from "../../tools/cachedRetriever";

// export default function CompanyLogo({deployment, jobCompany}) {
export default function CompanyLogo() {

    // const [clientId, setClientId] = useState(null);
    // const [domain, setDomain] = useState(null);

    const dispatch = useDispatch();
    const { deployment, logoClientId } = useSelector((state) => state.session);
    const { companyName, companyDomain } = useSelector((state) => state.company);

    useEffect(() => {
        const fetchLogoClientId = async () => {
            const response = await fetch(deployment+"/get-logo-client-id", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.text();
                // setClientId(result);
                dispatch(setLogoClientId(result));
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
                companyName.toLowerCase(),
                "/get-company-domain",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"company": companyName})
                }
            );
            // setDomain(result.domain);
            dispatch(setDomain(result.domain));
        }
        if (!logoClientId) fetchLogoClientId();
        if (!companyDomain) fetchCompanyDomain();
    }, []);

    if (companyName === "UNSPECIFIED") return null;

    return (
        logoClientId && companyDomain &&
        <img className="company-logo" src={`https://cdn.brandfetch.io/${companyDomain}?c=${logoClientId}`} alt={companyName}/>
    );
}
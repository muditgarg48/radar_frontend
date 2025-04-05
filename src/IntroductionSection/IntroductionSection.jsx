import React from "react";
import './IntroductionSection.css';

export default function IntroductionSection({serverStatus}) {
    return (
        <div id="introduction-section">
            <div id="website-title">
                RaDAR
            </div>
            <div id="server-status">
                {serverStatus}
            </div>
            <h3 id="website-subtitle">
                Resume and Job Description Analyzer
            </h3>
            <p>
                Job Search can be a very daunting journey, one filled with a lot of failures. I, myself, am currently (as of March 2025) going through the same journey. With the current job market, the competition has become very tough. From layoffs going on one side of the industry, to even experienced candidates applying for entry level roles, getting an opportunity has never felt short of a battle. 
            </p>
            <p>
                Anything help or guidance at this instance can be a blessing in disguise. Any suggestion for resume improvement, any suggestion for job hunting strategy improvement, anything could be your edge against other candidates out there. So I decided to create a tool that can help you in your job search journey. 
            </p>
            <p>
                RaDAR is a tool I came up with which incorporates all the suggestions I have ever been given to optimize my job search, improve my resume, and improve my job hunting strategy.
            </p>
        </div>
    );
}
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { invalidateCaches } from "../../store/features/sessionSlice.js";
import './IntroductionSection.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export default function IntroductionSection() {
    
    const dispatch = useDispatch();
    const { serverStatus } = useSelector((state) => state.session);
    
    return (
        <div id="introduction-section">
            <div id="website-title">
                RaDAR
            </div>
            <div id="server-status">
                {serverStatus}
            </div>
            <h3 id="website-subtitle">
                Resume and Description Analysis Resource
            </h3>
            <div id="website-description">
                Today's job hunt is a perfect storm: <strong>mass layoffs</strong>, <strong>AI screening tools</strong>, and <strong>senior candidates competing for junior roles</strong>. As someone currently in the trenches, I built RaDAR to give you what most applicants lack, a data-driven edge. <em>Why not bring our own AI driven optimised tool?</em> This tool combines insights from recruiters, career coaches from various sources you encounter daily in your job search. From social media posts that give "advices" to my own notes from interviews, rejections, networking and application journey into one battle-tested platform.
            </div>
            <Tabs id="why-website">
                <TabList>
                    <Tab>Why RaDAR?</Tab>
                    <Tab>Why Not ChatGPT?</Tab>
                    <Tab>What You Get?</Tab>
                </TabList>
                <TabPanel>
                    <ul className="why-website-list" id="why-radar">
                        <div className="why-website-heading">Why RaDAR?</div>
                        <li>Built by a job seeker for job seekers</li>
                        <li>Powered by Gen AI with only required content and additional resources</li>
                        <li>Regular updates with market shifts</li>
                    </ul>
                </TabPanel>
                <TabPanel>
                    <ul className="why-website-list" id="why-not-chatgpt">
                        <div className="why-website-heading">Why not ChatGPT?</div>
                        <li>Generic advice with unnecessary filler content</li>
                        <li>Requires extensive Prompt Engineering for a close to ideal output</li>
                        <li>No tracking system for job applications</li>
                    </ul>
                </TabPanel>
                <TabPanel>
                    <ul className="why-website-list" id="what-you-get">
                        <div className="why-website-heading">What You Get</div>
                        <li>Resume analysis and instant actionable steps</li>
                        <li>Job description breakdown with key role and company insights with additional document generation</li>
                        <li>One stop shop for all job portals</li>
                    </ul>
                </TabPanel>
            </Tabs>
            <br/>
            <div id="introduction-section-footnote">
                <a href="https://muditgarg48.github.io/" target="_blank" rel="noopener noreferrer">
                    <button>
                        About the Developer
                    </button>
                </a>
                &nbsp;
                &nbsp;
                <button onClick={() => dispatch(invalidateCaches())}>
                    Invalidate Caches
                </button>
            </div>
            <br/>
        </div>
    );
}
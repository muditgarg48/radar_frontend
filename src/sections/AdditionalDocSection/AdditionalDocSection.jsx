import React from "react";
import './AdditionalDocSection.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import AdditionalMessageSection from "../AdditionalMessageSection/AdditionalMessageSection.jsx";
import CoverLetterSection from "../CoverLetterSection/CoverLetterSection.jsx";

export default function AdditionalDocSection() {

    return (
        <div id="additional-docs-section">
            <p>
                Please note, you <strong>MUST NOT</strong> use these generated documents directly. It has been generated based on your resume and job description via a Generative AI and it bound to have a lot of issues and will lack the personal touch of a human. Recruiters and Hiring Managers are capable of easily identifying AI generated documents.
                <br/>
                Instead, use it as a starting point for your own document. There will be some suggestions on how to start to improve each generated document. Use them as your guide to make them your own.
            </p>
            <Tabs>
                <TabList>
                    <Tab>Cover Letter</Tab>
                    <Tab>Additional Message</Tab>
                </TabList>
                <TabPanel>
                    <CoverLetterSection/>
                </TabPanel>
                <TabPanel>
                    <AdditionalMessageSection/>
                </TabPanel>
            </Tabs>
        </div>
    );
}
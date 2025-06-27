import React from 'react';
import errorSign from '../../assets/error.gif';
import './ErrorLogo.css';

export default function ErrorLogo ({errorMessage}) {
    return (
        <div className="error-container">
            <img src={errorSign} alt="Error Sign" width="100px" height="100px"/>
            <h3 className="error-message">{errorMessage}</h3>
            <div className="error-footnote">
                Please report back to me at <u><a href="mailto:gargmu@tcd" style={{textDecoration: "none", color: "black"}}>gargmu@tcd.ie</a></u>?
            </div>
        </div>
    );
}
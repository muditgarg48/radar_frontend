import React from 'react';
import notfoundSign from '../../assets/notfound.gif';
import './NotFoundLogo.css';

export default function NotFoundLogo ({notfoundMessage}) {
    return (
        <div className="notfound-container">
            <img src={notfoundSign} alt="Not Found Sign" width="100px" height="100px"/>
            <h3 className="notfound-message">{notfoundMessage}</h3>
            <div className="notfound-footnote">
                Please report back the missing data to me at <u><a href="mailto:gargmu@tcd" style={{textDecoration: "none", color: "black"}}>gargmu@tcd.ie</a></u>
            </div>
        </div>
    );
}
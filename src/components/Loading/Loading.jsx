import React from "react";
import HashLoader from "react-spinners/HashLoader";

import './Loading.css';

export default function Loading({loading, message}) {
    
    return (
        <div className="loading">
            <HashLoader
                color="grey"
                loading={loading}
                size={150}
            />
            { loading?<p>{message}</p>:null}
        </div>
    );
}
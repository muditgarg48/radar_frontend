import React, {useEffect} from "react";
import "./HistorySection.css";
import { useSelector, useDispatch } from "react-redux";
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { setApplicationHistory } from "../../store/features/sessionSlice.js";
import { format } from 'date-fns';
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo.jsx";

export default function HistorySection() {

    const dispatch = useDispatch();
    const { applicationHistory } = useSelector((state) => state.session);

    const statusOptions = [
        { value: 'not_applied', label: 'Not Applied', color: '#9CA3AF' },
        { value: 'applied', label: 'Applied', color: '#60A5FA' },
        { value: 'assessment', label: 'Assessment', color: '#F59E0B' },
        { value: 'interview', label: 'Interviewing', color: '#8B5CF6' },
        { value: 'accepted', label: 'Accepted', color: '#10B981' },
        { value: 'declined', label: 'Declined', color: '#64748B' },
        { value: 'rejected', label: 'Rejected', color: '#EF4444' },
    ];

    const getStatusData = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return {
            backgroundColor: option.color,
            color: "white",
            label: option.label
        };
    };

    const customStyles = {
        table: {
            style: {
                backgroundColor: "transparent"
            }
        },
        rows: {
            style: {
                minHeight: '60px',
            },
        },
        headCells: {
            style: {
                fontSize: '15px',
                fontWeight: '600',
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    const columns = [
        {
            name: 'Processed On',
            selector: row => format(new Date(row.timestamp), 'MMM dd, yyyy hh:mm a'),
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.title,
        },
        {
            name: 'Company',
            selector: row => row.company,
        },
        {
            name: 'Status',
            cell: row => (
                <Select
                    defaultValue={statusOptions.find(opt => opt.value === row.status)}
                    options={statusOptions}
                    onChange={(selected) => handleStatusChange(row.id, selected.value)}
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: getStatusData(row.status).backgroundColor,
                            color: getStatusData(row.status).color,
                            minHeight: '32px',
                            width: '150px',
                            borderRadius: '40px',
                        }),
                        menu: (base) => ({
                            ...base,
                            fontSize: '13px',
                            zIndex: 9999,
                            marginTop: '0'
                        }),
                    }}
                    menuPortalTarget={document.body}
                />
            ),
            ignoreRowClick: true
        },
        {
            name: 'Resume Used',
            selector: row => row.resumeName,
        },
    ];

    useEffect(() => {
        let history = localStorage.getItem("RADAR_HISTORY");
        if (history !== null) {
            history = JSON.parse(history); 
            dispatch(setApplicationHistory(history));
        }
    }, []);

    function clearHistory () {
        if (window.confirm("Clear application history?")) {
            localStorage.setItem("RADAR_HISTORY", JSON.stringify([]));
            dispatch(setApplicationHistory([]));
        }
    }

    const ExpandedJobDetails = ({ data }) => {
        const salaries = data.salary_bracket?.split(";");
        const experiences = data.experience_level?.split(";");
        const locations = data.location?.split(";");
        return(
            <div className="history-job-details">
                <div className="history-job-details-header">
                    <div className="history-job-details-within-header">
                        <CompanyLogo company={data.company}/>
                        &nbsp;
                        &nbsp;
                        <div>
                            <div className="history-job-title">{data.title}</div>
                            <div className="history-job-team">{data.team_name}</div>
                            <div className="history-job-company">{data.company}</div>
                        </div>
                    </div>
                    <div className="remove-history-job" onClick={() => removeApplication(data.id)}>
                        <h3>DELETE</h3>
                    </div>
                    &nbsp;
                    &nbsp;
                    <div className="history-job-details-status" style={{backgroundColor: getStatusData(data.status).backgroundColor}}>
                        <h3>{getStatusData(data.status).label.toUpperCase()}</h3>
                    </div>
                </div>
                <div className="history-job-details-subheader">
                    {salaries && <div id="jd-salary-bracket">
                        <span>🤑</span>
                        &nbsp;
                        &nbsp;
                        <div>
                            {salaries.map((salary, index) => {
                                return (
                                    <div key={index}>
                                        {salary}
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    {experiences && <div id="jd-experience-level">
                        <span>🏢</span>
                        &nbsp;
                        &nbsp;
                        <div>
                            {experiences.map((experience, index) => {
                                return (
                                    <div key={index}>
                                        {experience}
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    {data.visa_sponsorship && <div id="jd-sponsorship">
                        Visa Sponsorship: {data.visa_sponsorship? "✅" : "❌"}
                    </div>}
                    {locations && <div id="jd-location">
                        <span>📌</span>
                        &nbsp;
                        &nbsp;
                        <div>
                            {locations.map((location, index) => {
                                return (
                                    <div key={index}>
                                        {location}
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                </div>
                <div className="history-job-details-keywords">
                    <h5>HARD SKILLS</h5>
                    <ul>
                    {
                        "hard_skills" in data.keywords && data.keywords.hard_skills.map((word, index) => {
                            if (word.length == 0) {return null;}
                            return (
                                <li className="jd-keyword" key={index}>
                                    {word}
                                </li>
                            )
                        })
                    }
                    </ul>
                    <h5>SOFT SKILLS</h5>
                    <ul>
                    {
                        "soft_skills" in data.keywords && data.keywords.soft_skills.map((word, index) => {
                            if (word.length == 0) {return null;}
                            return (
                                <li className="jd-keyword" key={index}>
                                    {word}
                                </li>
                            )
                        })
                    }
                    </ul>
                    <h5>OTHER KEYWORDS</h5>
                    <ul>
                    {
                        "other_keywords" in data.keywords && data.keywords.other_keywords.map((word, index) => {
                            if (word.length == 0) {return null;}
                            return (
                                <li className="jd-keyword" key={index}>
                                    {word}
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
                <div>
                    {data.benefits && <div>
                        <h5>💪  KEY BENEFITS</h5>
                        <ul>
                        {
                            data.benefits.map((benefit, index) => {
                                return (<li key={index}>{benefit}</li>)
                            })
                        }
                        </ul>
                    </div>}
                    <h5>📝  NOTE</h5>
                    <ul>
                    {
                        data.notes.map((note, index) => {
                            return (<li key={index}>{note}</li>)
                        })
                    }
                    </ul>
                </div>
                <div className="history-job-description">
                    <h5>JOB DESCRIPTION</h5>
                    {data.jd.split("\n").map((paragraph, index) => {
                        return (
                            <div key={index}>
                                {paragraph}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const handleStatusChange = (id, newStatus) => {
        const updatedHistory = applicationHistory.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
        );
        dispatch(setApplicationHistory(updatedHistory));
        localStorage.setItem("RADAR_HISTORY", JSON.stringify(updatedHistory));
    };

    const removeApplication = (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) {return;}
        const updatedHistory = applicationHistory.filter(app => app.id !== id);
        dispatch(setApplicationHistory(updatedHistory));
        localStorage.setItem("RADAR_HISTORY", JSON.stringify(updatedHistory));
    };

    if (!applicationHistory) return null;
    return (
        <div id="history-section">
            <h2 className="section-heading">APPLICATION HISTORY</h2>
            <p className="section-description">
                This section will help you keep track of all the job applications you have processed through RaDAR, helping you maintain a clear understanding of your job search journey.
            </p>
            <DataTable
                columns={columns}
                data={applicationHistory}
                customStyles={customStyles}
                pagination
                highlightOnHover
                pointerOnHover
                responsive
                fixedHeader
                expandableRows
                expandableRowsComponent={ExpandedJobDetails}
                defaultSortFieldId={1}
                defaultSortAsc={false}
            />
            <br/>
            <div className="section-footer">
                <button onClick={clearHistory}>Clear History</button>
            </div>
        </div>
    );
}
import React, {useEffect} from "react";
import "./HistorySection.css";
import { useSelector, useDispatch } from "react-redux";
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { setApplicationHistory } from "../../store/features/sessionSlice.js";
import { format } from 'date-fns';

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

    const getStatusStyle = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return {
            backgroundColor: option.color,
            color: "white",
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
            name: 'Resume Used',
            selector: row => row.resumeName,
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
                            backgroundColor: getStatusStyle(row.status).backgroundColor,
                            color: getStatusStyle(row.status).color,
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
        return(
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        );
    }

    const handleStatusChange = (id, newStatus) => {
        const updatedHistory = applicationHistory.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
        );
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
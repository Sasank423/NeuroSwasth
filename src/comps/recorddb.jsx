import React, { useState, useEffect, useRef } from "react";

import { ChevronLeft, ChevronRight, HardDriveUpload, ArrowLeft, Download } from "lucide-react";

import Header from "./header";
import Spinner from "./styles/spinner";

import './styles/recorddb.css';
import { show_error, show_success } from "./utils/Alerts";

import { ToastContainer } from "react-toastify";


const fields = [
    {'name': 'CT'},
    {'name': 'MRI'},
    {'name': 'X ray'},
    {'name': 'Urine analysis'},
    {'name': 'ECG'},
    {'name': 'Ultrasound'},
    {'name': 'KFT'},
    {'name': 'LFT'},
    {'name': 'CBP'},
    {'name': 'Blood Glucose'},
    {'name': 'Lipid profile'},
    {'name': 'EEG'},
    {'name': 'Echo'},
    {'name': 'Histopathology report'}
];

export default function RecordDB() {

    const linkRef = useRef(null);

    const [msg, setMsg] = useState([false, false, ''])
    const [loading, setLoading] = useState(false);
    const [hide, setHide] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [Upload ,setUpload] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    const [report, setReport] = useState(null);
    const [preview, setPreview] = useState(null);

    const [fname, setFname] = useState('');

    const [cur, setCur] = useState('All');

    const [files, setFiles] = useState([{fname:'', type: selectedValue, image:null,url:'', hovered: false}])


    const handleSubmit = async () => {
        setLoading(true);
        try {
            if(report === null){
                throw new Error('Please select a Document')
            }
            if(fname === '' || selectedValue === ''){
                throw new Error('Please enter all details')
            }
            const formData = new FormData();
            formData.append('file', report);
            formData.append('name', fname);
            formData.append('type', selectedValue);

            const response = await fetch('/api/upload/file', {
                method: 'POST',
                body: formData
            });

            setLoading(false);
            const res = await response.json()
            if(res.status ==='success') {
                setMsg([true, false, 'Report Uploaded Successfully'])
            } else {
                setMsg([false, true, 'Failed to Upload Report']);
            }
            setFname('');
            setReport(null);
            setPreview(null);
            setSelectedValue('');
        } catch(e) {
            setLoading(false);
            setMsg([false, true, e.message]);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/get/pdf", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: '' }),
                });
    
                const data = await response.json();
                if (data){
                    setFiles(data.data);
                } 
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };
    
        fetchData();
    }, []);
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReport(file);
            setFname(file.name);
            const fileURL = URL.createObjectURL(file);
            setPreview(file.type === "application/pdf" ? `${fileURL}` : fileURL);
        }
    };


    useEffect(() => {
        if (hide) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 350);
            
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [hide]);

    useEffect(() => {
        if (msg[0]){
            show_success(msg[2]);
            setMsg([false, false, '']);
        }
        else if (msg[1]){
            show_error(msg[2]);
            setMsg([false, false, '']);
        }
    }, [msg]);

    if (loading ) {
        return <Spinner />;
    }

    if(Upload) {

        return<>
                <Header comp={'Medical Record Store'}/>
                <div className="uprecordbox">
                    <ArrowLeft className="dbackbtn" onClick={() => setUpload(false)}/>
                    <div className="uploadbox">
                        <div className="dpreview">
                            {preview && <iframe src={preview} width="100%" height="500px" title="PDF Preview"></iframe>}
                        </div>
                        <div className="ditem">
                            <label>Enter the Report Name</label>
                            <input type="text" value={fname} onChange={(e) => setFname(e.target.value)}/>
                        </div>
                        <div className="ditem-2">
                            <label>Select Report Type:</label>
                            <select
                                value={selectedValue}
                                onChange={(e) => setSelectedValue(e.target.value)}
                            >
                                <option value="">-- Choose --</option>
                                {fields.map((field, i) => (<option style={{'color':'black'}} value={field.name} key={i}>{field.name}</option>))}
                            </select>
                        </div>
                        <div className="ditem-3">
                            <div className="dbut">
                                <button onClick={handleSubmit}>Upload</button>
                            </div>
                            <div>
                                <input id="rep" accept="image/*, application/pdf" style={{ display: 'none' }} type="file" onChange={handleFileChange} />
                                    <div className="dinput" onClick={() => document.getElementById('rep').click()}>
                                        <HardDriveUpload />
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </>
    }


    return (
        <>
            <Header comp={'Medical Record Store'}/>
            <div className="uprecordbox">
                <div className={`rdbsidebar ${hide ? "collapsed" : ""}`}>
                    <button className="toggle-btn" onClick={() => setHide(!hide)}>
                        {hide ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                    <div className="dbconts">
                        <div onClick={() => setCur('All')} className="dbconts-item">
                            <h3>All</h3>
                        </div>
                        {fields.map((field, index) => (
                            <div key={index} onClick={() => setCur(field.name)} className="dbconts-item">
                                <h3>{field.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dbupload">
                    <button title="Upload a Medical Report" onClick={() => setUpload(true)}><HardDriveUpload /></button>
                </div>
                <div className="dbmain">
                    {isVisible && 
                        <button className="toggle-btn1" onClick={() => setHide(!hide)}>
                            <ChevronRight size={20} />
                        </button>
                    }
                    <div className="dprev">
                        <h1>{cur} Medical Records</h1>
                        <div className="drecs">
                        {files.map((file, i) => {
                                return (cur === 'All' || cur.replace(/\s+/g, '').toLowerCase() === file.bucket.replace(/\s+/g, '').toLowerCase()) && (
                                    <div key={i} 
                                    onMouseLeave={() => setFiles(prevFiles => 
                                        prevFiles.map(p => p.fname === file.fname ? { ...p, hovered: false } : p)
                                    )} 
                                    onMouseEnter={() => setFiles(prevFiles => 
                                        prevFiles.map(p => p.fname === file.fname ? { ...p, hovered: true } : p)
                                    )} 
                                        className={`dprevitem${file.hovered ? '-sel' : ''}`}>
                                        
                                        <img src={file.image} alt="alternative"></img>
                                        { file.hovered && <>
                                            <label>{file.fname}</label>
                                            <a ref={linkRef} href={file.url} download style={{ display: "none" }}>Download</a>
                                            <Download onClick={() => linkRef.current.click()} />
                                        </>}
                                    </div>
                                ) 
                            })}  
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

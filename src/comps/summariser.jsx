import React, { useState } from "react";
import { HardDriveUpload } from "lucide-react";
import Header from "./header";

import './styles/summariser.css';

export default function Summariser() {
    const [report, setReport] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReport(file);
            const fileURL = URL.createObjectURL(file);
            setPreview(file.type === "application/pdf" ? `${fileURL}` : fileURL);
        }
    };

    return <>
        <Header comp={"Medical Reocrd Summariser"}/>
        <div className="sum_main_cont">
            <div className="sum_ip_box">
                <h1>Upload the Medical Document</h1>
                <div className="sum_prev">
                    <div className="spreview">
                        {/* Image Preview */}
                        {report?.type.startsWith("image/") && <img src={preview} alt="Preview" />}

                        {/* PDF Preview */}
                        {report?.type === "application/pdf" && <iframe src={preview} width="100%" height="500px" title="PDF Preview"></iframe>}
                        
                    </div>
                    
                    <input id="rep" accept="image/*, application/pdf" style={{ display: 'none' }} type="file" onChange={handleFileChange} />
                    <button title="Upload the medical Report" className="sum_ip_btn" onClick={() => document.getElementById('rep').click()}>
                        <HardDriveUpload />
                    </button>
                </div>
                <button className="sum_sub">Summarise</button>
            </div>
        </div>
    </>
    
    
}

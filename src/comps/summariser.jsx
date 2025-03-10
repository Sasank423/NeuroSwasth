import React, { useState } from "react";
import { HardDriveUpload } from "lucide-react";
import Header from "./header";

import './styles/summariser.css';

export default function Summariser() {
    const [report, setReport] = useState(null);
    const [preview, setPreview] = useState(null);
    const [ip, setIP] = useState(true); // Default state

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReport(file);
            const fileURL = URL.createObjectURL(file);
            setPreview(file.type === "application/pdf" ? `${fileURL}` : fileURL);
        }
    };

    return (
        <div>
            <Header comp={"Medical Report Analyser"}/>
            <div className="smainbox">
                {ip && (
                    <>
                        <input id="rep" accept="image/*, application/pdf" style={{ display: 'none' }} type="file" onChange={handleFileChange} />
                        <div className="sinput" onClick={() => document.getElementById('rep').click()}>
                            <HardDriveUpload />
                            <p>Upload the medical Report</p>
                        </div>
                    </>
                )}

                {preview && (
                    <div className={ip ? "spreview" : "spreviewmin"}>
                        {/* Image Preview */}
                        {report?.type.startsWith("image/") && ip && <img src={preview} alt="Preview" />}
                        {report?.type.startsWith("image/") && !ip && <p>{report.name}</p>}

                        {/* PDF Preview */}
                        {report?.type === "application/pdf" && ip && <iframe src={preview} width="100%" height="500px" title="PDF Preview"></iframe>}
                        {report?.type === "application/pdf" && !ip && <p>{report.name}</p>}

                        <button onClick={() => setIP(!ip)}>{ip ? "Summarise" : "Back"}</button>
                    </div>
                )}

                {!ip && (
                    <div className="ssummary">
                        <h1>Summary :</h1>
                    </div>
                )}
            </div>
        </div>
    );
}

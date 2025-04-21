import React, { useState } from "react";
import { HardDriveUpload } from "lucide-react";
import Header from "./header";

import './styles/summariser.css';
import { ToastContainer } from "react-toastify";
import { DNA } from "react-loader-spinner";
import { show_error, show_info, show_success } from "./utils/Alerts";

export default function Summariser() {
    const [report, setReport] = useState(null);
    const [preview, setPreview] = useState(null);

    const [shift, setShift] = useState(false);
    const [load, setLoad] = useState(false);

    const [op, setOP] = useState(
        "<main>\n    <section>\n        <h1>Patient Summary</h1>\n        <article>\n            <h2>Patient Information</h2>\n            <ul>\n                <li><strong>Age:</strong> 45</li>\n                <li><strong>Gender:</strong> Male</li>\n            </ul>\n        </article>\n    </section>\n\n    <section>\n        <h2>Urgent Alerts</h2>\n        <ul class=\"alerts\">\n            <li><strong>None:</strong> No urgent issues identified based on the current results.</li>\n        </ul>\n    </section>\n\n    <section>\n        <h2>Key Results Explained</h2>\n        <article>\n            <h3>Heart Health (Cardiology)</h3>\n            <ul>\n                <li><strong>ECG:</strong> Normal heart rhythm with no signs of stress or damage.</li>\n                <li><strong>Troponin:</strong> Very low level, which is normal and suggests no recent heart injury.</li>\n            </ul>\n        </article>\n        <article>\n            <h3>Blood Sugar (Endocrinology)</h3>\n            <ul>\n                <li><strong>HbA1c:</strong> <data value=\"6.5\" unit=\"%\">6.5%</data> <small>(Normal: 4.0-5.6%)</small>, which is at the borderline for diabetes. This indicates slightly high blood sugar levels over the past few months.</li>\n            </ul>\n        </article>\n        <article>\n            <h3>Blood Health (Hematology)</h3>\n            <ul>\n                <li><strong>Hemoglobin:</strong> Normal level, indicating healthy red blood cells.</li>\n                <li><strong>White Blood Cells:</strong> Normal count, suggesting no signs of infection or immune system issues.</li>\n            </ul>\n        </article>\n    </section>\n\n    <section>\n        <h2>Specialist Takeaways</h2>\n        <article>\n            <h3>Cardiology</h3>\n            <p>The normal ECG and low troponin are reassuring, but further evaluation may be needed if the patient has symptoms like chest pain or shortness of breath, or if they have risk factors like high blood pressure, diabetes, or smoking.</p>\n        </article>\n        <article>\n            <h3>Endocrinology</h3>\n            <p>The HbA1c level is borderline for diabetes. Lifestyle changes (diet, exercise, weight management) are the first step. Medications like metformin may be considered if lifestyle changes aren’t enough or if there are additional risk factors.</p>\n        </article>\n        <article>\n            <h3>Hematology</h3>\n            <p>No issues detected with hemoglobin or white blood cells. No further tests are needed unless new symptoms arise.</p>\n        </article>\n    </section>\n\n    <section>\n        <h2>Action Plan</h2>\n        <ol class=\"actions\">\n            <li>\n                <h3>Heart Health</h3>\n                <ul>\n                    <li>Monitor for symptoms like chest pain, shortness of breath, or palpitations.</li>\n                    <li>If symptoms occur or risk factors are present, consider further tests like a stress test or referral to a cardiologist.</li>\n                </ul>\n            </li>\n            <li>\n                <h3>Blood Sugar Management</h3>\n                <ul>\n                    <li>Start with lifestyle changes: eat healthier, exercise regularly, and aim for weight loss if overweight.</li>\n                    <li>Repeat the HbA1c test to confirm the result.</li>\n                    <li>Discuss the possibility of starting medication (like metformin) with a doctor if lifestyle changes aren’t effective or if additional risk factors are present.</li>\n                </ul>\n            </li>\n            <li>\n                <h3>Blood Health</h3>\n                <ul>\n                    <li>No immediate action needed. Continue routine check-ups and monitor for any new symptoms like fatigue, bruising, or frequent infections.</li>\n                </ul>\n            </li>\n        </ol>\n    </section>\n\n    <aside>\n        <h2>Follow-Up</h2>\n        <ul>\n            <li>Schedule a follow-up with a primary care doctor to review results and discuss next steps.</li>\n            <li>Consider seeing an endocrinologist for further guidance on blood sugar management if needed.</li>\n        </ul>\n    </aside>\n</main>"
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReport(file);
            const fileURL = URL.createObjectURL(file);
            setPreview(file.type === "application/pdf" ? `${fileURL}` : fileURL);
        }
    };

    const handleSubmit = async () => {
        setShift(true);
        setLoad(true);
        show_info('Started summarising!!');
        const formData = new FormData();
        formData.append('file', report)
        try {
            const response = await fetch("/api/summarise", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            show_success('Done Summarising');
            setOP(data.html_summary);
        }catch(error) {
            show_error('unable to process!!!')
        }

        setLoad(false);
        
    }

    if(shift) {
        return <>
            <Header comp={"Medical Record Summarizer"}/>
            <div className="sum_main_cont">
                {load ? <div className="sum_spin"><DNA
                        visible={true}
                        height="150"
                        width="200"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                        /></div>:
                    <div
                    className="sum_op_box"
                    dangerouslySetInnerHTML={{ __html: op }}
                    ></div>
                }
            </div>
            <ToastContainer />
        </>
    }

    return <>
        <Header comp={"Medical Record Summarizer"}/>
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
                <button className="sum_sub" onClick={handleSubmit}>Summarise</button>
            </div>
        </div>
        <ToastContainer />
    </>
    
    
}

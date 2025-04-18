import React from "react";

import Header from "./header";

import './styles/msf.css'

export default function Msf() {

    const data = {name:"Dolo 650 Tablet 15's", price:'₹30.38', img:'https://www.netmeds.com/images/product-v1/150x150/45296/dolo_650_tablet_15s_35281_0_3.jpg', url:'https://www.netmeds.com/prescriptions/dolo-650mg-tablet-15-s'}
    const desc = '<h1>Medicine Description</h1>Dolo 650 Tablet helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain. It is used to treat headaches, migraine, toothaches, sore throats, period (menstrual) pains, arthritis, muscle aches, and the common cold. <br><br>Dolo 650 Tablet has been one of the most widely prescribed paracetamol-based medications during the COVID-19 pandemic. It should be taken regularly as per the doctor’s advice. Take it with food to avoid an upset stomach. It may be taken alone or in combination with other medications. However, no more than four doses of Dolo 650 Tablet can be taken in 24 hours with a gap of at least 4 hours between two doses. Please do not take it for longer than recommended.<br><br>Generally, Dolo 650 Tablet is well tolerated, and side effects are rare. However, it may temporarily cause stomach pain, nausea, and vomiting in some people. Consult the doctor if any of these side effects persist or become bothersome.<br><br>Though Dolo 650 Tablet is essentially safe, it may not suit everyone. Before taking this medicine, let the doctor know if you have any liver or kidney problems, are allergic to it, or are taking other medications as this might affect the dose or suitability of the medicine. In general, take the lowest dose that works for the shortest possible time. It is also the first choice of painkillers during pregnancy or breastfeeding.';

    return (
        <>
            <Header />
            <div className="msfmain">
                <div className="msfip"></div>
                <div className="msfop">
                    <a  href={data.url} target="_blank" rel="noopener noreferrer">
                        <div className="msfopitem">
                            <img src={data.img} alt="img"></img>
                            <label>{data.name}</label>
                            <label>{data.price}</label>
                        </div>
                    </a>
                    <div
                    className="msfopitemdesc"
                    dangerouslySetInnerHTML={{ __html: desc }}
                    ></div>
                </div>
            </div>
        </>
    )
}
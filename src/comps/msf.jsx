import React, { useState } from "react";

import Header from "./header";

import './styles/msf.css';
import { Search } from "lucide-react";
import { DNA } from "react-loader-spinner";

export default function Msf() {


    const [shift, setShift] = useState(false);
    const [load, setLoad] = useState(false);
    const [ip, setIP] = useState('');
    const [data,setData] = useState({});

    const handleSubmit = async () => {
        setShift(true);
        setLoad(true);

        try {
            const res = await fetch("/api/get/medicine", {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({'ip':ip}),
            });

            const dat = await res.json();
            if(dat){
                console.log(dat)
                setData(dat)
            }
        } catch(e) {
            console.error(e);
        }


        setLoad(false);

    }

    return (
        <>
            <Header comp={'Online Medicine Shopping'}/>
            <div className="msfmain">
                <div className="msfip">
                    <label>Enter the Name of the Medicine</label>
                    <input type="text" value={ip} onChange={(e) => setIP(e.target.value)}></input>
                    <button onClick={handleSubmit}><Search /></button>
                </div>
                
                <div className={shift ?"msfop":"msfophide"}>
                    {load ? <div className="mffload">
                                <DNA
                                    visible={true}
                                    height="150"
                                    width="200"
                                    ariaLabel="dna-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="dna-wrapper"
                                />
                            </div> :shift && <>
                                                <a  href={data.url} target="_blank" rel="noopener noreferrer">
                                                    <div className="msfopitem">
                                                        <img src={data.img} alt="img"></img>
                                                        <label>{data.name}</label>
                                                        <label>{data.price}</label>
                                                    </div>
                                                </a>
                                                <div
                                                className="msfopitemdesc"
                                                dangerouslySetInnerHTML={{ __html: data.desc }}
                                                ></div>
                                            </>
                    }
                </div>
            </div>
        </>
    )
}
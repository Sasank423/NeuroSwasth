import React, {useEffect,useState} from 'react';
import { useNavigate } from "react-router-dom";

import img from "./props/hrt.png";
import './styles/login.css';

export default function Otp({email,type}) {

    const nav = useNavigate();

    

    useEffect(() => {
      const handleBeforeUnload = (e) => {
        const message = "Are you sure you want to leave this page? All the progress will be lost";
        e.returnValue = message; 
        return message;
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);

    return <>
            <div className="sl_cont">
                <div className="sl_titl">
                    <img src={img} alt="icn"/>
                    <h1>NeuroSwasth</h1>
                </div>
                <div className="sl_cont-box">
                    <label className="sl_header">OTP</label>
                    <label className="sl_capt1">{type === 'signup' ? "Create your medical account securely" : "Log into your medical account securely"}</label>
    
                   
                    <div className="sl_block">
                        <label >Enter OTP sent to your mail</label>
                        <input type="number" placeholder="Enter OTP..." required />
                    </div>
                    
                    <button>{type === 'signup' ? "Sign Up" : "Log In"}</button>
                </div>
            </div>
        </>
}
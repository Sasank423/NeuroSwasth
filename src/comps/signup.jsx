import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Otp from './otp';

import img from "./props/hrt.png";
import './styles/login.css';

export default function Signup() {
    const nav = useNavigate();

    const [otpstate, setOTPstate] = useState(false);

    const [name, setName] = useState('');

    if (otpstate) {
        return (<Otp email={name} type={'signup'} />);
    }

    return <>
        <div className="sl_cont">
            <div className="sl_titl1">
                <img src={img} alt="icn" />
                <h1 >NeuroSwasth</h1>
            </div>
            <div className="sl_cont-box">
                <label className="sl_header">Sign Up</label>
                <label className="sl_capt1">Create your medical account securely</label>

                <div className="sl_block">
                    <label>Enter your Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your Username..." required />
                </div>
                <div className="sl_block">
                    <label>Enter your email address</label>
                    <input type="email" placeholder="Enter your Email..." required />
                </div>
                <div className="sl_block">
                    <label>Enter your Mobile Number</label>
                    <input type="number" placeholder="Enter your Mobile number..." required />
                </div>
                <div className="sl_block">
                    <label>Enter your password</label>
                    <input type="password" placeholder="Enter your password..." required />
                </div>
                <div className="sl_tag">
                    <label>Forgot your password?</label>
                </div>
                <button onClick={() => setOTPstate((t) => !t)}>Sign Up</button>
                <label className="sl_redir" onClick={() => nav('/')}>Already have an account? Log In !!!</label>
            </div>
        </div>
    </>
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Otp from "./otp";

import img from "./props/hrt.png";
import './styles/login.css';

export default function Login() {
    const nav = useNavigate();

    const [otpstate, setOTPstate] = useState(false);
    const [email, setEmail] = useState('');

    if (otpstate) {
        return (<Otp email={email} type={'login'} />);
    }
    return <>
        <div className="sl_cont">
            <div className="sl_titl">
                <img src={img} alt="icn" />
                <h1>NeuroSwasth</h1>
            </div>
            <div className="sl_cont-box">
                <label className="sl_header">Log In</label>
                <label className="sl_capt">Access your medical account securely</label>
                <div className="sl_block">
                    <label >Enter your email address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email..." required />
                </div>
                <div className="sl_block">
                    <label >Enter your password</label>
                    <input type="password" placeholder="Enter your password..." required />
                </div>
                <div className="sl_tag">
                    <label>Forgot your password?</label>
                </div>
                <button onClick={() => setOTPstate(true)}>Log In</button>
                <label className="sl_redir" onClick={() => nav('/signup')}>Don't have an account? Sign Up !!!</label>
            </div>
        </div>
    </>
}

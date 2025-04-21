import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./styles/spinner";

import Otp from './otp';

import img from "./props/hrt.png";
import './styles/login.css';

export default function Signup() {
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);

    const [otpstate, setOTPstate] = useState(false);
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');
    const [mobile,setMobile] = useState('');

    useEffect(() => {
        const delayMilliseconds = 1000;
    
        
        const timer = setTimeout(() => {
            setLoading(false);
        }, delayMilliseconds);
    
        
        return () => clearTimeout(timer);
      }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username,email,mobile,password })  // Pass the email to the server
              });
              
              const data = await response.json();
              if(data.status === "success"){
                setOTPstate(true);
                setOTP(data.otp);
              }
              else{
                throw new Error(data.message);
              }
        } catch (error) {
            alert(error.message);
        }
    }

    if (otpstate) {
        return (<Otp email={email}  type={'signup'} username={username} otp={otp}/>);
    }

    if(loading) {
        return <Spinner />; 
    }


    return <>
        <div className="sl_cont">
            <div className="sl_titl1">
                <img src={img} alt="icn" />
                <h1 >NeuroSwasth</h1>
            </div>
            <div className="sl_cont-box">
                <form onSubmit={handleSubmit}>
                    <label className="sl_header1">Sign Up</label>
                    <label className="sl_capt2">Create your medical account securely</label>

                    <div className="sl_block">
                        <label>Enter your Name</label>
                        <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your Username..." required />
                    </div>
                    <div className="sl_block">
                        <label>Enter your email address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email..." required />
                    </div>
                    <div className="sl_block">
                        <label>Enter your Mobile Number</label>
                        <input type="number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter your Mobile number..." required />
                    </div>
                    <div className="sl_block">
                        <label>Enter your password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password..." required />
                    </div>
                    <button type="submit" className='sl_button' >Sign Up</button>
                </form>
                <label className="sl_redir" onClick={() => nav('/login')}>Already have an account? Log In !!!</label>
            </div>
        </div>
    </>
}

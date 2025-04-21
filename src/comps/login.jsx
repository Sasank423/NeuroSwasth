import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import Spinner from "./styles/spinner";
import Otp from "./otp";


import img from "./props/hrt.png";
import './styles/login.css';

export default function Login() {
    const nav = useNavigate();

    const {setNotif} = useAuth();

    const [loading, setLoading] = useState(true);

    const [otpstate, setOTPstate] = useState(false);
    const [otp, setOTP] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


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
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email,password })  // Pass the email to the server
              });
              
              const data = await response.json();
              if(data.status === "success"){
                setOTPstate(true);
                setUsername(data.username);
                setOTP(data.otp);
                setNotif((t) => ({...t, notif:true,msg:'OTP sent successfully'}))
              }
              else{
                throw new Error(data.message);
              }
        } catch (error) {
            alert(error.message);
        }
    }

    if (otpstate) {
        return (<Otp email={email} type = {'login'} username={username} otp={otp}/>);
    }


    if(loading) {
            return <Spinner />; 
    }

    return <>
        <div className="sl_cont">
            <div className="sl_titl">
                <img src={img} alt="icn" />
                <h1>NeuroSwasth</h1>
            </div>
            <div className="sl_cont-box">
                <label onKe className="sl_header">Log In</label>
                <label className="sl_capt">Access your medical account securely</label>
                <form onSubmit={handleSubmit}>
                    <div className="sl_block">
                        <label >Enter your email address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email..." required />
                    </div>
                    <div className="sl_block">
                        <label >Enter your password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password..." required />
                    </div>
                    <div className="sl_tag">
                        <label>Forgot your password?</label>
                    </div>
                    <button className="sl_button" type='submit'>Log In</button>
                </form>
                <label className="sl_redir" onClick={() => nav('/signup')}>Don't have an account? Sign Up !!!</label>
            </div>
        </div>
    </>
}

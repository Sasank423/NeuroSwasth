import React, {useEffect,useState} from 'react';
import { ToastContainer } from 'react-toastify';

import { useAuth } from './utils/AuthContext';
import { useNavigate } from 'react-router-dom';

import {show_success, show_error} from './utils/Alerts';
import Spinner from "./styles/spinner";

import img from "./props/hrt.png";
import './styles/login.css';

export default function Otp({email,type,username,otp}) {

  const nav = useNavigate();

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
          const delayMilliseconds = 1000;
      
          
          const timer = setTimeout(() => {
              setLoading(false);
          }, delayMilliseconds);
      
          
          return () => clearTimeout(timer);
        }, []);
  
    const {loginUser} = useAuth();
  
    const [enteredotp, setEnteredOTP] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://127.0.0.1:5000/otp', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ otp,enteredotp,mode:type,username,email })
            });
            
            const data = await response.json();
            if(data.status === "success" && type === 'login'){
               setLoading(true);
               show_success('Logged In Succesfully'); //add signup and login seperatly later
               await sleep(3000);
               loginUser({username,email})
               setLoading(false);
               nav('/home');
            }
            else if(data.status === "success" && type ==='signup'){
              setLoading(true);
              show_success('Account Created Succesfully');
              await sleep(3000);
              setLoading(false);
              nav('/login');
              
            }
            else{
              throw new Error(data.message);
            }
      } catch (error) {
          show_error(error.message);
      }        
    }

    if(loading) {
            return <Spinner />; 
    }

    return <>
            <div className="sl_cont">
                <div className="sl_titl">
                    <img src={img} alt="icn"/>
                    <h1>NeuroSwasth</h1>
                </div>
                <div className="sl_cont-box">
                  <form onSubmit={handleSubmit}>
                      <label className="sl_header">OTP</label>
                      <label className="sl_capt1">{type === 'signup' ? "Create your medical account securely" : "Log into your medical account securely"}</label>
                      <div className="sl_block">
                          <label >Enter OTP sent to your mail</label>
                          <input type="number" value={enteredotp} onChange={(e) => setEnteredOTP(e.target.value)} placeholder="Enter OTP..." required />
                      </div>
                      <button className='sl_button' type='submit'>{type === 'signup' ? "Sign Up" : "Log In"}</button>
                  </form>
                </div>
            </div>
            <ToastContainer />
        </>
}
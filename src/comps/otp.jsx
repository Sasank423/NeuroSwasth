import React, {useEffect,useState} from 'react';
import { ToastContainer } from 'react-toastify';

import { useAuth } from './utils/AuthContext';
import { useNavigate } from 'react-router-dom';

import show_msg from './utils/Alerts';

import Spinner from "./styles/spinner";

import img from "./props/hrt.png";
import ppic from "./props/image.png";
import './styles/login.css';

export default function Otp({email,type,username,otp}) {

  const [profilepic,setProfilePic] = useState(ppic);
  const [preview, setPreview] = useState(ppic);
  const [pp, setPP] = useState(false);  //change to false

  const [showToast, setShowToast] = useState([false, '']);

  const { loginUser, setNotif, getNotif } = useAuth();

  const nav = useNavigate();

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
          const delayMilliseconds = 1000;
      
          
          const timer = setTimeout(() => {
              setLoading(false);
              const notif  = getNotif();
              const show = show_msg(notif);
              if(show) {
                setShowToast([show, notif.msg])
              }
              setNotif({success: false, error: false, notif: false, msg: ""});
          }, delayMilliseconds);
      
          
          return () => clearTimeout(timer);
        }, );
  
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

    useEffect(() => {
        if (showToast[0]) {
          showToast[0](showToast[1]);
          setShowToast([false, '']);
        }
    
    }, [showToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('/api/otp', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ otp,enteredotp,mode:type,username,email })
            });
            
            const data = await response.json();
            if(data.status === "success" && type === 'login'){
               setLoading(true);
               await sleep(3000);
               loginUser({username,email,'profilePic' : data.profilepic,'mobile':data.mobile})
               setLoading(false);
               setNotif((t) => ({ ...t, success: true, msg: 'Login Successful' }));
               nav('/home');
            }
            else if(data.status === "success" && type ==='signup'){
              setLoading(true);
              await sleep(3000);
              setLoading(false);
              setPP(true);
              
            }
            else{
              throw new Error(data.message);
            }
      } catch (error) {
          
      }        
    }

    const handleFileChange = (event) => {
      console.log(event)
      const file = event.target.files[0];
      if (file) {
        console.log('updated');
        setProfilePic(file);
        setPreview(URL.createObjectURL(file));
      }
    };

    const handlePP = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("image", profilepic);
      formData.append("email", email);
  
      try {
        const response = await fetch("/api/profilepic", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        if (data.status === "success") {
          await sleep(3000);
          setPP(false);
          nav('/login');
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    if(pp) {
      return <> 
                <div className="sl_cont">
                <div className="sl_titl">
                    <img src={img} alt="icn"/>
                    <h1>NeuroSwasth</h1>
                </div>
                <div className="sl_cont-box">
                  <form onSubmit={handlePP}>
                      <label style={{'margin-left': '75px', 'display': 'block', 'font-size': '40px', 'font-weight': '700', 'color': '#333333'}}>Profile Picture</label>
                      <div className="sl_block">
                          <img src={preview} alt="Uploaded Preview" />
                          <input id='ppip' className='fileip' type="file" onChange={(e) => handleFileChange(e)} accept='image/*'/>
                          <label htmlFor="ppip" className="custom-button">Choose File</label>
                      </div>
                      <button className='sl_button' type='submit'>Continue</button>
                  </form>
                </div>
            </div>
            <ToastContainer />
        </>
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
import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import show_msg, { show_info } from './utils/Alerts';
import { ToastContainer } from 'react-toastify';
import Spinner from './styles/spinner';


import Header from './header';
import { useAuth } from './utils/AuthContext';

import './styles/profile.css'


export default function Profile() {

    const {refresh, getUsername, getEmail, getMobile, getProfilePic, setNotif, getNotif} = useAuth();

    const [loading, setLoading] = useState(false);
 
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState(getProfilePic());
    const [preview, setPreview] = useState(getProfilePic());
    const [name,setName] = useState(getUsername());
    const email = getEmail();
    const [phone, setPhone] = useState(getMobile());

    const [picChange, setPicChange] = useState('no');

    const showToast = getNotif();

    const handleFileChange = (event) => {
        console.log(image);
        const file = event.target.files[0];
        if (file) {
          setImage(file);
          setPreview(URL.createObjectURL(file));
          setPicChange('yes');
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("image", image);
        formData.append("email", email);
        formData.append("mobile", phone);
        formData.append("name",name);
        formData.append('change',picChange)
        try {
            const response = await fetch("/api/update/profile", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setLoading(false);
            if (data.status === "success") {
                setEdit(false);
                refresh({success: true, error: false, notif: false, msg: "Profile updated successfully"});
            }
        }catch (error) {
            refresh({success: false, error: true, notif: false, msg: "Error updating profile"});
        }
    }

    useEffect(() => {
        const show = show_msg(showToast);
        if(show) {
            show(showToast.msg);
            setNotif({success: false, error: false, notif: false, msg: ""});
        }
    }, );

    if(loading) {
        return <Spinner />;
    }
    
    return (<>
                <Header />
                <div className='maincont'>
                    <h1>Profile</h1>
                    <div className='profcont'>
                        <div className='details'>
                            <div>
                                <label className='field'>Username</label>
                                {edit ? <input type='text' className='value' value={name} onChange={(e) => setName(e.target.value)}/> :<label className='value'>{name}</label> }
                            </div>
                            <div>
                                <label className='field'>Email</label>
                                <label className='value'>{email}</label>
                            </div>
                            <div>
                                <label className='field'>Mobile</label>
                                {edit ? <input type='number' value={phone} className='value' onChange={(e) => setPhone(e.target.value)}/> :<label className='value'>{phone}</label>}
                            </div>
                        </div>
                        <div className='profdet'>
                            <input id='ppic' type='file' accept='images/*' onChange={handleFileChange} style={{'display':'none'}}/>
                            {edit?
                            <label for='ppic' className="imgcont">
                                <img src={preview} alt="profilepic" />
                                <Pencil size={40} className="pencil-icon" />
                            </label> : <img src={preview} alt="profilepic" />}
                            {edit ? <button onClick={handleSubmit}>Confirm changes</button> :<button onClick={() => {setEdit(true);show_info('Edit your profile')}}>Edit Profile</button>}
                        </div>
                        
                    </div>
                </div>
                <ToastContainer />
            </>
    );
}
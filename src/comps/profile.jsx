import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import {show_error, show_info, show_success} from './utils/Alerts';
import { ToastContainer } from 'react-toastify';
import Spinner from './styles/spinner';


import Header from './header';
import { useAuth } from './utils/AuthContext';

import './styles/profile.css'


export default function Profile() {

    const {refresh, getUsername, getEmail, getMobile, getProfilePic} = useAuth();

    const [loading, setLoading] = useState(false);
 
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState(getProfilePic());
    const [preview, setPreview] = useState(getProfilePic());
    const [name,setName] = useState(getUsername());
    const email = getEmail();
    const [phone, setPhone] = useState(getMobile());

    const handleFileChange = (event) => {
        console.log(image);
        const file = event.target.files[0];
        if (file) {
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("image", image);
        formData.append("email", email);
        formData.append("mobile", phone);
        formData.append("name",name);
        try {
            const response = await fetch("http://127.0.0.1:5000/update/profile", {
                method: "POST",
                body: formData,
            });
            setLoading(false);
            const data = await response.json();
            if (data.status === "success") {
                show_success("Profile picture updated successfully");
                setEdit(false);
            }
        }catch (error) {
            show_error("Error uploading file:", error);
        }
        setLoading(false);
        refresh();
    }

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
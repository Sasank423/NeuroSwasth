import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Bell } from "lucide-react";
import logo from "./props/hrt.png";
import "./styles/header.css";

import { useAuth } from "./utils/AuthContext";

export default function Header({mode}) {

    const nav = useNavigate();
    const {logoutUser,getProfilePic} = useAuth();

    const [drop, setDrop] = useState(false);
    const img = getProfilePic();

    if (mode === "about") {
        return (<div className="aheader">
                    <div className="title">
                        <img src={logo} alt="Logo"/>
                        <h1>NeuroSwasth</h1>
                    </div>
                    <div className="aauth-buttons">
                        <button className="aauth-btn" onClick={() => nav('/login')}>Login</button>
                        <button className="aauth-btn" onClick={() => nav('/signup')}>Sign Up</button>
                    </div>
                  </div>);
    }

    return (
        <div>
            <div className="header">
                <div className="title">
                    <img src={logo} alt="Logo"/>
                    <h1>NeuroSwasth</h1>
                </div>
                <div className="auth-buttons">
                    <label onClick={() => nav('/home')}>Home</label>
                    <Bell className="bell" size={20} />
                    <div onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                        <img src={img} alt="Profile Pic"/> {/* Toggle dropdown on click */}
                        {drop && (
                            <div className="p_contents">
                                {/* Dropdown menu content */}
                                <ul>
                                    <li onClick={() => nav('/profile')}>Profile</li>
                                    <li onClick={logoutUser}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

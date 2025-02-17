import React from "react";
import { useAuth } from "./utils/AuthContext";


export default function Header() {
    const { logoutUser } = useAuth();
    return (
        <div className="header">
          <div className="title">
            <h1>NeuroSwasth</h1>
          </div>
          <div className="auth-buttons">
            <button className="auth-btn" onClick={() => logoutUser()}>LogOut</button>
          </div>
        </div>
    );
}
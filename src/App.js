import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './comps/utils/PrivateRoutes'
import { AuthProvider } from './comps/utils/AuthContext'

import Login from './comps/login';
import Signup from './comps/signup';
import About from './comps/about';
import Error from './comps/error';
import Home from './comps/home';
import Profile from './comps/profile';
import Chatbot from './comps/chatbot';
//import Otp from './comps/otp';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
          <Route path="/*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;



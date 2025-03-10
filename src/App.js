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
import Summariser from './comps/summariser';
import RecordDB from './comps/recorddb';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Summariser />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/summariser" element={<Summariser />} />
            <Route path="/recorddb" element={<RecordDB />} />
          </Route>
          <Route path="/*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;



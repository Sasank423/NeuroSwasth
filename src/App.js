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
import Mff from './comps/mff';
import Sof from './comps/sof';
import Tracker from './comps/calorie';
import Msf from './comps/msf';
import Ghs from './comps/ghs';
import Srs from './comps/srs';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/summariser" element={<Summariser />} />
            <Route path="/recorddb" element={<RecordDB />} />
            <Route path="/mff" element={<Mff />} />
            <Route path="/sof" element={<Sof />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/msf" element={<Msf />} />
            <Route path="/ghs" element={<Ghs />} />
            <Route path="/srs" element={<Srs />} />
          </Route>
          <Route path="/*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;



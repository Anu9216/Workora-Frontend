import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Add from './pages/Add';
import Gigs from './pages/Gigs';
import Gig from './pages/Gig';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pay from './pages/Pay';
import Success from './pages/Success';
import Messages from './pages/Messages';
import Message from './pages/Message';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import ScrollToTop from './components/ScrollToTop';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="gigs" element={<Gigs />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add" element={<Add />} />
              <Route path="gig/:id" element={<Gig />} />
              <Route path="pay/:id" element={<Pay />} />
              <Route path="success" element={<Success />} />
              <Route path="messages" element={<Messages />} />
              <Route path="message/:id" element={<Message />} />
              <Route path="profile" element={<Profile />} />
              <Route path="user/:id" element={<PublicProfile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

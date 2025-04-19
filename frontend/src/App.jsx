import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
  UserProfile,
  RedirectToSignIn,
  SignedIn,
  SignedOut
} from '@clerk/clerk-react';

import Dashboard from './pages/Dashboard';
import GreenSuggestions from './pages/GreenSuggestions';
import Declutter from './pages/Declutter';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Features from './pages/Features';

const App = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<ClerkSignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up" element={<ClerkSignUp routing="path" path="/sign-up" />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />
          <Route
            path="/green-suggestions"
            element={
              <SignedIn>
                <GreenSuggestions />
              </SignedIn>
            }
          />
          <Route
            path="/declutter"
            element={
              <SignedIn>
                <Declutter />
              </SignedIn>
            }
          />
          
          <Route
            path="/profile"
            element={
              <SignedIn>
                <UserProfile />
              </SignedIn>
            }
          />
          

          {/* Catch-all for unauthorized users */}
          <Route
            path="*"
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

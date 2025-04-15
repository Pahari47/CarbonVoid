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

import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Optional
// import SignIn from './auth/SignIn';
// import SignUp from './auth/SignUp';




const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/sign-in" element={<ClerkSignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up" element={<ClerkSignUp routing="path" path="/sign-up" />} />

        {/* Protected Routes - visible only to signed-in users */}
        <Route
          path="/"
          element={
            <SignedIn>
              <Dashboard />
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

        {/* Catch-all for signed-out users */}
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
  );
};

export default App;
import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, SignOutButton } from '@clerk/clerk-react';

const Home = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 to-white px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to CarbonCrumbs 🌱
        </h1>

        <SignedIn>
          <p className="text-lg text-gray-600 mb-4">
            Hello, <span className="font-semibold">{user.firstName || user.username}</span>!
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <Link
              to="/dashboard"
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              Go to Dashboard
            </Link>
            <SignOutButton>
              <button className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50 transition">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>

        <SignedOut>
          <p className="text-lg text-gray-600 mb-6">
            Track your digital carbon footprint and make greener choices with AI-powered insights.
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <Link
              to="/sign-in"
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </SignedOut>

        <div className="text-sm text-gray-500">
          Empowering users and businesses to reduce hidden digital emissions — one byte at a time.
        </div>
      </div>
    </div>
  );
};

export default Home;
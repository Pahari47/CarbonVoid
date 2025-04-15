import React from 'react';
import { useUser, SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold text-green-700">
          CarbonCrumbs
        </Link>
      </div>

      <div className="flex space-x-4 items-center">
        <SignedIn>
          {user && (
            <span className="text-gray-700 font-medium">
              Welcome, {user.firstName || user.username}
            </span>
          )}
          <Link
            to="/dashboard"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Dashboard
          </Link>
          <SignOutButton>
            <button className="text-red-500 hover:text-red-600 transition font-medium">
              Sign Out
            </button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <Link
            to="/sign-in"
            className="text-green-600 hover:text-green-700 transition font-medium"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition"
          >
            Sign Up
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;

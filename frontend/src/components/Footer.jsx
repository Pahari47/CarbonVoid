import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-green-900 text-white py-8 relative z-50">
      <div className="container mx-auto  flex flex-col md:flex-row justify-between items-center">
        {/* Left Side - Quick Links */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-green-500">Home</a></li>
              <li><a href="/about" className="hover:text-green-500">About</a></li>
              <li><a href="/carbon-emission" className="hover:text-green-500">Features</a></li>
              <li><a href="/trends-insights" className="hover:text-green-500">Trends & Insights</a></li>
              <li><a href="/contact" className="hover:text-green-500">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Middle - Call to Action (Join Waitlist) */}
        <div className="mt-8 md:mt-0 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Join the Waitlist</h3>
          <p className="mb-4">Stay updated on our mission to reduce carbon emissions.</p>
          <form action="#" method="post" className="flex items-center space-x-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg text-black w-64"
            />
            <button type="submit" className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600">Subscribe</button>
          </form>
        </div>

        {/* Right Side - Social Links & Trust Signals */}
        <div className="mt-8 md:mt-0 flex flex-col  items-center md:items-end">
          <div className="space-x-4 mb-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500">
              <i className="fab fa-instagram fa-2x"></i>
            </a>
          </div>
          <p className="text-sm text-gray-400">© 2025 CarboVoid, All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Partners: <span className="font-semibold">GreenTech, EcoPartnership</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

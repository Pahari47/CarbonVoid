import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GreenSuggestions = () => {
  const [userData, setUserData] = useState({
    cloudStorage: '',
    videoHours: '',
    screenTime: '',
  });
  const [suggestions, setSuggestions] = useState([]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch green suggestions from the backend
  const getGreenSuggestions = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/green-suggestions', userData);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Submit form to get suggestions
  const handleSubmit = (e) => {
    e.preventDefault();
    getGreenSuggestions();
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-green-700 mb-6 text-center">🌿 Green Suggestions</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Cloud Storage Used (in GB):</label>
          <input
            type="number"
            name="cloudStorage"
            value={userData.cloudStorage}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter cloud storage used"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Video Streaming Hours:</label>
          <input
            type="number"
            name="videoHours"
            value={userData.videoHours}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter video streaming hours"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">Screen Time (in hours):</label>
          <input
            type="number"
            name="screenTime"
            value={userData.screenTime}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter screen time"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Get Suggestions
        </button>
      </form>

      <div className="mt-8">
        {suggestions.length === 0 ? (
          <p className="text-gray-500 text-center">No suggestions available. Enter your data to get recommendations.</p>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md mt-4">
              <p className="text-gray-800">{suggestion}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GreenSuggestions;

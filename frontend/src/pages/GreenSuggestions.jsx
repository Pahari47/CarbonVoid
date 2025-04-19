import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const GreenSuggestions = () => {
  const [userData, setUserData] = useState({
    cloudStorage: '',
    screenTime: '',
  });
  const [co2Emission, setCo2Emission] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-usage');
        const { cloudStorage, screenTime, totalCO2 } = response.data;
        setUserData({ cloudStorage, screenTime });
        setCo2Emission(totalCO2);
      } catch (error) {
        console.error("Error fetching usage data:", error);
      }
    };
    fetchData();
  }, []);

  const getGreenSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/green-suggestions', userData);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mt-12 max-w-2xl mx-auto p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20"
    >
      <h2 className="text-4xl font-bold text-green-400 mb-8 text-center">🌱 Eco Tips for You</h2>

      <div className="space-y-6 text-white">
        <div>
          <label className="block text-lg font-semibold text-green-100">☁️ Cloud Storage Used (in GB)</label>
          <div className="p-3 mt-2 rounded-lg bg-white/20 text-white border border-white/30">
            {userData.cloudStorage || 'Fetching...'}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-green-100">🖥️ Screen Time (in hours)</label>
          <div className="p-3 mt-2 rounded-lg bg-white/20 text-white border border-white/30">
            {userData.screenTime || 'Fetching...'}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-green-100">🌍 Total CO₂ Emission</label>
          <div className="p-3 mt-2 text-lg font-bold  text-white text-center rounded-xl shadow-inner">
            {co2Emission !== null ? `${co2Emission} kg` : 'Calculating...'}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={getGreenSuggestions}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 shadow-lg'
          }`}
        >
          {loading ? 'Fetching Suggestions...' : 'Get Green Suggestions'}
        </motion.button>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-center text-gray-300">Loading suggestions...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">Click the button above to see recommendations 🌿</p>
        ) : (
          suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 border border-white/30 text-white p-4 rounded-lg shadow-md mt-4"
            >
              <p>✅ {suggestion}</p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default GreenSuggestions;

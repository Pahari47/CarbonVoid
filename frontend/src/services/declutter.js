// src/api/declutter.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/declutter'; // Your backend API URL

// Fetch declutter suggestions and carbon stats
export const fetchDeclutterAndStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/declutterAndStats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching declutter suggestions and stats:', error);
    throw error;
  }
};

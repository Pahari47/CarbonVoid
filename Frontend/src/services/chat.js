import axios from 'axios';

export const sendMessageToGreenBot = async (message) => {
  try {
    const response = await axios.post('http://localhost:5000/api/chat', { message });
    return response.data.reply;
  } catch (error) {
    console.error('Error contacting GreenBot:', error);
    return "Oops! Something went wrong.";
  }
};
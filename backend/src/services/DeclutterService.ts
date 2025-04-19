import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

export const fetchDeclutterSuggestions = async () => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates digital declutter suggestions to reduce carbon footprint.',
          },
          {
            role: 'user',
            content: 'Give me 5 digital declutter suggestions to optimize digital carbon usage.',
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract message content
    const suggestions = response.data.choices[0].message.content;
    return suggestions;
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to fetch suggestions from Groq.');
  }
};

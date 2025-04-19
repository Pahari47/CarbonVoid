import { ChatOllama } from '@langchain/community/chat_models/ollama';
import dotenv from 'dotenv';

dotenv.config();

const localLLM = new ChatOllama({
  baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'mistral',
  temperature: 0.7,
});

export default localLLM;
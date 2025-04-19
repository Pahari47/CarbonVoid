import { Request, Response } from 'express';
import greenBotChain from '../chains/greenBotChain.js';  // Ensure this path is correct

export const handleChat = async (req: Request, res: Response): Promise<Response> => {
  const { message } = req.body;

  // Ensure the message exists in the request body
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Call the greenBotChain to get the response
    const result = await greenBotChain.call({ input: message });

    // Log the result for debugging (optional)
    console.log('Result from GreenBot:', result);

    // Return the response to the client
    return res.json({ reply: result.response });
  } catch (err: any) {
    // Log the error and provide a more descriptive error message
    console.error('ChatController Error:', err);
    return res.status(500).json({ error: 'GreenBot failed to respond.', details: err.message });
  }
};

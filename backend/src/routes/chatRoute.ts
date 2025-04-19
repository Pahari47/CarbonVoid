import { Router } from 'express';
import { handleChat } from '../controllers/chatController.js';  // Ensure this path is correct

const router = Router();

// Define the /chat POST route to handle user input
router.post('/chat', handleChat);

export default router;

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { sendMessageToGreenBot } from '../services/chat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me how to reduce your digital carbon footprint 🌿' },
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const botReply = await sendMessageToGreenBot(input);
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: botReply || "Sorry, I couldn't find an answer." },
    ]);

    setInput('');
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-green-600 p-4 rounded-full text-white shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white border rounded-2xl shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 font-semibold rounded-t-2xl">
            Ask the GreenBot 🌍
          </div>

          {/* Chat messages */}
          <div
            ref={chatRef}
            className="p-4 h-64 overflow-y-auto flex flex-col gap-3 bg-gray-50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-line ${
                  msg.sender === 'bot'
                    ? 'bg-green-100 text-gray-800 self-start'
                    : 'bg-gray-200 text-black self-end'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex border-t p-3 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your question..."
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up {
            animation: slideUp 0.3s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default ChatWidget;
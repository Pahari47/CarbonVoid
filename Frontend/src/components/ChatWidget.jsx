// import React, { useState, useRef, useEffect } from 'react';
// import { MessageSquare, X, Mic, MicOff } from 'lucide-react';
// import { sendMessageToGreenBot } from '../services/chat';

// const ChatWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: 'bot', text: 'Hi! Ask me how to reduce your digital carbon footprint 🌿' },
//   ]);
//   const [input, setInput] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [speechSupported, setSpeechSupported] = useState(true);
//   const chatRef = useRef(null);
//   const recognitionRef = useRef(null);

//   // Initialize speech recognition
//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = 'en-US';

//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(prev => prev + ' ' + transcript);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error', event.error);
//         setIsListening(false);
//         setMessages(prev => [...prev, {
//           sender: 'bot', 
//           text: "Sorry, I couldn't hear you properly. Please try again."
//         }]);
//       };

//       recognitionRef.current.onend = () => {
//         if (isListening) {
//           recognitionRef.current.start();
//         }
//       };
//     } else {
//       setSpeechSupported(false);
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [isListening]);

//   const toggleChat = () => setIsOpen(!isOpen);

//   const toggleListening = () => {
//     if (!speechSupported) {
//       setMessages(prev => [...prev, {
//         sender: 'bot', 
//         text: "Your browser doesn't support speech recognition. Try Chrome or Edge."
//       }]);
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       try {
//         recognitionRef.current.start();
//         setIsListening(true);
//         setMessages(prev => [...prev, {
//           sender: 'bot', 
//           text: "I'm listening... Speak now."
//         }]);
//       } catch (error) {
//         console.error('Speech recognition start failed:', error);
//         setIsListening(false);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Stop listening if active when submitting
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }

//     const userMessage = { sender: 'user', text: input };
//     setMessages((prev) => [...prev, userMessage]);

//     const botReply = await sendMessageToGreenBot(input);
//     setMessages((prev) => [
//       ...prev,
//       { sender: 'bot', text: botReply || "Sorry, I couldn't find an answer." },
//     ]);

//     setInput('');
//   };

//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <>
//       <div className="fixed bottom-6 right-6 z-50">
//         <button
//           onClick={toggleChat}
//           className="bg-green-600 p-4 rounded-full text-white shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
//         >
//           {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
//         </button>
//       </div>

//       {isOpen && (
//         <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white border rounded-2xl shadow-2xl flex flex-col animate-slide-up">
//           {/* Header */}
//           <div className="bg-green-600 text-white p-4 font-semibold rounded-t-2xl flex justify-between items-center">
//             <span>Ask the GreenBot 🌍</span>
//             <button 
//               onClick={toggleListening}
//               className={`p-1 rounded-full ${isListening ? 'bg-red-500' : 'bg-green-700'} hover:opacity-80`}
//               title={isListening ? "Stop listening" : "Start voice input"}
//             >
//               {isListening ? <MicOff size={18} /> : <Mic size={18} />}
//             </button>
//           </div>

//           {/* Chat messages */}
//           <div
//             ref={chatRef}
//             className="p-4 h-64 overflow-y-auto flex flex-col gap-3 bg-gray-50"
//           >
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-line ${
//                   msg.sender === 'bot'
//                     ? 'bg-green-100 text-gray-800 self-start'
//                     : 'bg-gray-200 text-black self-end'
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//             {isListening && (
//               <div className="max-w-[75%] px-4 py-2 rounded-xl text-sm bg-green-100 text-gray-800 self-start flex items-center">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
//                   <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
//                   <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
//                 </div>
//                 <span className="ml-2">Listening...</span>
//               </div>
//             )}
//           </div>

//           {/* Input */}
//           <form onSubmit={handleSubmit} className="flex border-t p-3 bg-white">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder={isListening ? "Speak now..." : "Type your question..."}
//               disabled={isListening}
//             />
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 transition"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes slideUp {
//             from { transform: translateY(40px); opacity: 0; }
//             to { transform: translateY(0); opacity: 1; }
//           }
//           .animate-slide-up {
//             animation: slideUp 0.3s ease-out;
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default ChatWidget;



import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Leaf, Mic, Volume2 } from 'lucide-react';
import { sendMessageToGreenBot } from '../services/chat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! I\'m GreenBot 🌱\nAsk me about reducing your digital carbon footprint!' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const botReply = await sendMessageToGreenBot(input);
    const botMessage = { sender: 'bot', text: botReply || "I'm still learning about sustainability. Could you rephrase that?" };
    
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
    
    // Speak the bot's response
    if (botMessage.text) {
      speak(botMessage.text);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
          style={{
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <X size={20} className="transition-transform duration-200" />
          ) : (
            <>
              <MessageSquare size={20} className="transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 bg-emerald-400 text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                <Leaf size={10} />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chat Container */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-xl flex flex-col border border-gray-200 animate-slide-up"
          style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white bg-opacity-20 p-1 rounded-full">
                <Leaf size={16} />
              </div>
              <h3 className="font-semibold text-sm">GreenBot Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {isTyping ? 'Typing...' : 'Online'}
              </div>
              <button 
                onClick={() => speak(messages[messages.length - 1].text)}
                disabled={isSpeaking || messages[messages.length - 1]?.sender !== 'bot'}
                className={`p-1 rounded-full ${(isSpeaking || messages[messages.length - 1]?.sender !== 'bot') ? 'opacity-50' : 'hover:bg-white/10'}`}
                aria-label="Read last message"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div
            ref={chatRef}
            className="flex-1 p-3 overflow-y-auto bg-gradient-to-b from-emerald-50/50 to-white"
            style={{ height: '300px' }}
          >
            <div className="space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                      msg.sender === 'bot'
                        ? 'bg-white text-gray-800 shadow-sm border border-gray-100'
                        : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-sm border border-gray-100 flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <form 
            onSubmit={handleSubmit} 
            className="border-t border-gray-200 p-3 bg-white rounded-b-xl"
          >
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-lg ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-all`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                <Mic size={16} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                placeholder="Type or speak your question..."
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2 rounded-lg ${
                  input.trim()
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm hover:shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition-all`}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            {isListening && (
              <div className="mt-2 text-xs text-center text-emerald-600">
                Listening... Speak now
              </div>
            )}
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
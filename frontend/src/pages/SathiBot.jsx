import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Send, Lightbulb, Code, Sun, Moon, Trash2, Bot, User, Edit, Search } from 'lucide-react';

const SathiBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatListRef = useRef(null);

  const suggestions = [
    {
      text: "How do I start investing with a small amount of money?",
      icon: <Edit className="w-5 h-5" />
    },
    {
      text: "What is SIP (Systematic Investment Plan), and how does it work?",
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      text: "Can you explain the difference between ETFs and mutual funds?",
      icon: <Search className="w-5 h-5" />
    },
    {
      text: "How can I increase my savings rate without compromising my lifestyle?",
      icon: <Code className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: generateBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage) => {
    const responses = [
      "That's a great financial question! I'd recommend starting with understanding your financial goals and risk tolerance before making any investment decisions.",
      "For investment advice, it's always best to consult with a qualified financial advisor who can provide personalized guidance based on your specific situation.",
      "Here are some general principles to consider when planning your finances: diversification, regular saving, and long-term thinking are key to building wealth.",
      "I can help you understand basic financial concepts, but remember that every person's financial situation is unique and requires personalized planning."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (suggestionText) => {
    handleSendMessage(suggestionText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className={`min-h-screen transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900' 
          : 'bg-gradient-to-br from-purple-50 via-white to-purple-100'
      }`}>
        <div className="container mx-auto max-w-4xl h-screen flex flex-col">
          {/* Header */}
          <div className={`p-6 border-b backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-purple-800/50 border-purple-700' 
              : 'bg-white/50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${
                  isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                } shadow-lg`}>
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${
                  isDarkMode 
                    ? 'from-purple-400 to-pink-400' 
                    : 'from-purple-600 to-purple-700'
                } bg-clip-text text-transparent`}>
                  Sathi Bot
                </h1>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDarkMode 
                    ? 'bg-green-900/30 text-green-400 border border-green-700' 
                    : 'bg-green-100 text-green-600 border border-green-200'
                }`}>
                  Online
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-purple-700 hover:bg-purple-600 text-yellow-400' 
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={clearChat}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-purple-700 hover:bg-red-600 text-purple-300 hover:text-white' 
                      : 'bg-purple-100 hover:bg-red-100 text-purple-600 hover:text-red-600'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Welcome Screen or Chat Messages */}
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-2xl">
                <div className={`mb-8 ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  <Bot className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Welcome to Sathi Bot</h2>
                  <p className="text-lg opacity-80">
                    Your personal financial assistant. Ask me anything about investments, savings, and financial planning!
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-lg text-left ${
                        isDarkMode 
                          ? 'bg-purple-800/50 border-purple-700 hover:bg-purple-700/50' 
                          : 'bg-white/70 border-purple-200 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isDarkMode ? 'bg-purple-600 text-purple-200' : 'bg-purple-100 text-purple-600'
                        } transition-colors duration-200`}>
                          {suggestion.icon}
                        </div>
                        <h4 className={`text-sm font-medium leading-relaxed ${
                          isDarkMode ? 'text-purple-200' : 'text-purple-700'
                        }`}>
                          {suggestion.text}
                        </h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div 
              ref={chatListRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                    }`}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                    message.sender === 'user' ? 'order-1' : 'order-2'
                  }`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? isDarkMode 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-purple-500 text-white'
                        : isDarkMode 
                          ? 'bg-purple-800 text-purple-200 border border-purple-700' 
                          : 'bg-white text-purple-800 border border-purple-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    } ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 order-2 ${
                      isDarkMode ? 'bg-purple-600' : 'bg-purple-400'
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                  }`}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    isDarkMode 
                      ? 'bg-purple-800 border border-purple-700' 
                      : 'bg-white border border-purple-200'
                  }`}>
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                      }`}></div>
                      <div className={`w-2 h-2 rounded-full animate-pulse delay-75 ${
                        isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                      }`}></div>
                      <div className={`w-2 h-2 rounded-full animate-pulse delay-150 ${
                        isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                      }`}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className={`p-6 border-t backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-purple-800/50 border-purple-700' 
              : 'bg-white/50 border-purple-200'
          }`}>
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter a prompt here..."
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-purple-700 border-purple-600 text-white placeholder-purple-400' 
                      : 'bg-white border-purple-300 text-purple-900 placeholder-purple-500'
                  }`}
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  isDarkMode 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SathiBot;
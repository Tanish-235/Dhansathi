import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb, Code, Sun, Moon, Trash2, Bot, User, Edit, Search } from 'lucide-react';
import Footer from '../components/Footer.jsx';

const SathiBot = () => {
  const navigate = useNavigate();

  // --- State ---
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // --- Refs ---
  const chatListRef = useRef(null);
  const bottomRef = useRef(null);

  // --- Suggestions ---
  const suggestions = [
    {
      text: 'How do I start saving money with my monthly income?',
      icon: <Edit className="w-5 h-5" />
    },
    {
      text: 'What government schemes can help me save for my daughter\'s education?',
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      text: 'How can I apply for a small business loan to start my own shop?',
      icon: <Search className="w-5 h-5" />
    },
    {
      text: 'What is the best way to manage my household budget?',
      icon: <Code className="w-5 h-5" />
    }
  ];

  // --- Handlers ---
  const toggleTheme = () => setIsDarkMode((v) => !v);

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSuggestionClick = (suggestionText) => {
    handleSendMessage(suggestionText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSendMessage = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isTyping) return;

    // Push user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Request failed (${res.status}): ${errText || res.statusText}`);
      }

      const data = await res.json();
      const replyText =
        data?.reply?.trim() ||
        "Sorry, I couldn't process that. Please try rephrasing your question.";

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const botMsg = {
        id: Date.now() + 2,
        sender: 'bot',
        text:
          "Hmm, I'm having trouble reaching the server. Make sure your backend is running on port 5000 and CORS is configured for http://localhost:5173.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Effects: Auto-scroll to bottom whenever messages or typing state changes ---
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <>
      {/* Back to Home Page Button - Top Left */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold bg-white bg-opacity-80 px-4 py-2 rounded-xl shadow"
        >
          ← Back to Home Page
        </button>
      </div>
      {/* <Navbar /> */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900'
            : 'bg-gradient-to-br from-purple-50 via-white to-purple-100'
        }`}
      >
        <div className="container mx-auto max-w-4xl h-screen flex flex-col">
          {/* Header */}
          <div
            className={`p-6 border-b backdrop-blur-sm ${
              isDarkMode ? 'bg-purple-800/50 border-purple-700' : 'bg-white/50 border-purple-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-full ${
                    isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                  } shadow-lg`}
                >
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h1
                  className={`text-2xl font-bold bg-gradient-to-r ${
                    isDarkMode ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-purple-700'
                  } bg-clip-text text-transparent`}
                >
                  Dhansathi AI
                </h1>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode
                      ? 'bg-green-900/30 text-green-400 border border-green-700'
                      : 'bg-green-100 text-green-600 border border-green-200'
                  }`}
                >
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
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-2xl">
                <div className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'} mb-8`}>
                  <Bot className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Welcome to Dhansathi AI</h2>
                  <p className="text-lg opacity-80 mb-4">
                    Your personal financial mentor for rural women in India.
                  </p>
                  <p className="text-base opacity-70">
                    I can help you with: <strong>Budgeting • Saving • Banking • Loans • Government Schemes • Investments • Financial Planning</strong>
                  </p>
                  <p className="text-sm opacity-60 mt-2">
                    Ask me anything about money matters and financial empowerment!
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
                        <div
                          className={`p-2 rounded-lg ${
                            isDarkMode
                              ? 'bg-purple-600 text-purple-200'
                              : 'bg-purple-100 text-purple-600'
                          } transition-colors duration-200`}
                        >
                          {suggestion.icon}
                        </div>
                        <h4
                          className={`text-sm font-medium leading-relaxed ${
                            isDarkMode ? 'text-purple-200' : 'text-purple-700'
                          }`}
                        >
                          {suggestion.text}
                        </h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div ref={chatListRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                      }`}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                      message.sender === 'user' ? 'order-1' : 'order-2'
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? isDarkMode
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-500 text-white'
                          : isDarkMode
                            ? 'bg-purple-800 text-purple-200 border border-purple-700'
                            : 'bg-white text-purple-800 border border-purple-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      } ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 order-2 ${
                        isDarkMode ? 'bg-purple-600' : 'bg-purple-400'
                      }`}
                    >
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                    }`}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className={`p-4 rounded-2xl ${
                      isDarkMode ? 'bg-purple-800 border border-purple-700' : 'bg-white border border-purple-200'
                    }`}
                  >
                    <div className="flex space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse delay-75 ${
                          isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse delay-150 ${
                          isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Input Area */}
          <div
            className={`p-6 border-t backdrop-blur-sm ${
              isDarkMode ? 'bg-purple-800/50 border-purple-700' : 'bg-white/50 border-purple-200'
            }`}
          >
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about budgeting, saving, loans, government schemes, investments, or any financial topic..."
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
                aria-label="Send"
                title="Send"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SathiBot;

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';
import Navbar from "./Navbar"
import { useNavigate } from 'react-router-dom';

const MediBuddyChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your MediBuddy assistant. How can I help you with your health concerns today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
  
    const userMessage = input.trim();
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
  
      const response = await fetch('http://localhost:8080/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question: userMessage }),
        credentials: 'same-origin',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Network error occurred');
      }
  
      const data = await response.json();
      const aiResponse = data.generated_text || 'Sorry, I couldn\'t process your request.';
      const markdownResponse = convertToMarkdown(aiResponse);
  
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: markdownResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: error.message.includes('Authentication') 
            ? 'Your session has expired. Please log in again.' 
            : 'Sorry, there was an error processing your request. Please try again later.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToMarkdown = (text) => {
    let markdownText = text.trim();
    markdownText = markdownText.replace(/(\d+)\.\s+([^\n]+)/g, "$1. $2\n");
    markdownText = markdownText.replace(/\*\s+([^\n*]+)/g, "* $1\n");
    markdownText = markdownText.replace(/\*\*([^*]+)\*\*:/g, "### $1\n");
    return markdownText;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full px-4 md:px-8">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-4 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-600 ml-2' 
                    : 'bg-gray-100 text-gray-600 mr-2'
                }`}>
                  {message.role === 'user' ? 'U' : 'M'}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  } shadow-sm`}
                >
                  {message.role === 'assistant' ? (
                    <div className="markdown-content prose prose-sm max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] md:max-w-[75%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-2">
                  M
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 border border-gray-200 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="py-4 border-t border-gray-200">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => navigate('/ask-doctor')}
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium text-sm flex items-center"
            >
              Ask a Doctor
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-full shadow-md overflow-hidden border border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 focus:outline-none text-gray-700"
              placeholder="Type your health question here..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-full disabled:bg-blue-300 m-1 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-xs text-center mt-2 text-gray-500">
            MediBuddy helps answer your health questions, but it's not a substitute for professional medical advice.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediBuddyChatbot;

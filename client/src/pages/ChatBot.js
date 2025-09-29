import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, MessageCircle, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `# Welcome to DocBot AI! 🏥

I'm your **medical assistant** here to help answer your health questions and provide general medical information.

## What I can help you with:
- **General health questions**
- **Symptom information**
- **Medical condition explanations**
- **Treatment guidance**
- **Health tips and advice**

### How to get started:
1. Type your question in the chat box below
2. Click on any *quick question* from the sidebar
3. Ask about specific medical conditions

> **Important Note**: I provide general medical information for educational purposes only. Always consult with healthcare professionals for accurate diagnosis and treatment.

How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(`conv-${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await apiService.sendChatMessage({
        message: userMessage.content,
        conversation_id: conversationId
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickQuestions = [
    "What are the symptoms of flu?",
    "How to reduce fever naturally?",
    "When should I see a doctor?",
    "What is a healthy diet?",
    "How much water should I drink daily?",
    "What are signs of dehydration?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="chatbot">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">
            <MessageCircle className="title-icon" />
            AI Chat Assistant
          </h1>
          <p className="page-description">
            Chat with our intelligent medical assistant for health questions and guidance
          </p>
        </motion.div>

        <div className="chat-container">
          <motion.div 
            className="chat-window card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="chat-header">
              <div className="bot-info">
                <div className="bot-avatar">
                  <Bot size={24} />
                </div>
                <div>
                  <h3>DocBot AI</h3>
                  <span className="status">Online</span>
                </div>
              </div>
            </div>

            <div className="messages-container">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message-avatar">
                      {message.type === 'bot' ? (
                        <Bot size={20} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="message-content">
                      <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                        {message.type === 'bot' ? (
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Custom components for better styling
                              p: ({children}) => <p style={{margin: '0.5em 0', lineHeight: '1.5'}}>{children}</p>,
                              ul: ({children}) => <ul style={{margin: '0.5em 0', paddingLeft: '1.2em'}}>{children}</ul>,
                              ol: ({children}) => <ol style={{margin: '0.5em 0', paddingLeft: '1.2em'}}>{children}</ol>,
                              li: ({children}) => <li style={{margin: '0.2em 0'}}>{children}</li>,
                              strong: ({children}) => <strong style={{fontWeight: '600', color: '#2563eb'}}>{children}</strong>,
                              em: ({children}) => <em style={{fontStyle: 'italic', color: '#7c3aed'}}>{children}</em>,
                              code: ({children}) => <code style={{
                                backgroundColor: '#f1f5f9', 
                                padding: '0.2em 0.4em', 
                                borderRadius: '3px', 
                                fontSize: '0.875em',
                                color: '#dc2626'
                              }}>{children}</code>,
                              pre: ({children}) => <pre style={{
                                backgroundColor: '#f8fafc',
                                padding: '1em',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                overflow: 'auto',
                                fontSize: '0.875em'
                              }}>{children}</pre>,
                              blockquote: ({children}) => <blockquote style={{
                                borderLeft: '4px solid #3b82f6',
                                paddingLeft: '1em',
                                margin: '0.5em 0',
                                fontStyle: 'italic',
                                backgroundColor: '#f8fafc'
                              }}>{children}</blockquote>,
                              h1: ({children}) => <h1 style={{fontSize: '1.25em', fontWeight: '600', margin: '0.5em 0', color: '#1e293b'}}>{children}</h1>,
                              h2: ({children}) => <h2 style={{fontSize: '1.125em', fontWeight: '600', margin: '0.5em 0', color: '#1e293b'}}>{children}</h2>,
                              h3: ({children}) => <h3 style={{fontSize: '1.05em', fontWeight: '600', margin: '0.5em 0', color: '#1e293b'}}>{children}</h3>,
                              table: ({children}) => <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                margin: '0.5em 0'
                              }}>{children}</table>,
                              th: ({children}) => <th style={{
                                border: '1px solid #e2e8f0',
                                padding: '0.5em',
                                backgroundColor: '#f1f5f9',
                                fontWeight: '600'
                              }}>{children}</th>,
                              td: ({children}) => <td style={{
                                border: '1px solid #e2e8f0',
                                padding: '0.5em'
                              }}>{children}</td>
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className="message-time">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  className="message bot typing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="message-content">
                    <div className="message-bubble typing-indicator">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your health question here..."
                  className="chat-input"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={loading || !inputMessage.trim()}
                >
                  {loading ? (
                    <Loader className="spinning" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div 
            className="chat-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="quick-questions card">
              <h3>Quick Questions</h3>
              <p>Click on any question to get started:</p>
              <div className="questions-list">
                {quickQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    className="question-button"
                    onClick={() => handleQuickQuestion(question)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="chat-info card">
              <h3>Important Notice</h3>
              <ul>
                <li>This AI assistant provides general health information</li>
                <li>Not a substitute for professional medical advice</li>
                <li>For emergencies, contact your doctor or emergency services</li>
                <li>Always consult healthcare providers for serious concerns</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

import React, { useState, useEffect } from 'react';
import '../styles/chatbot.css';

const normalizeInput = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,!?;:]/g, '') // remove punctuation
    .trim();
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [lastIntent, setLastIntent] = useState('none');
  const [expandedExplanations, setExpandedExplanations] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load chat history
    fetch('/api/chat/history')
      .then(res => res.json())
      .then(data => {
        const history = data.history.reverse().map(chat => [
          { text: chat.user_message, sender: 'user' },
          { text: chat.bot_reply, sender: 'bot' }
        ]).flat();
        setMessages(history);
      })
      .catch(err => console.error('Error loading history:', err));
  }, []);

  const clearMessages = async () => {
    setMessages([]);
    try {
      await fetch('/api/chat/history', { method: 'DELETE' });
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  const toggleExplanation = (index) => {
    setExpandedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const normalizedInput = normalizeInput(input);
    setInput('');

    // Determine intent from input
    let currentIntent = 'none';
    if (normalizedInput.includes('tour')) currentIntent = 'tours';
    else if (normalizedInput.includes('recommend')) currentIntent = 'recommend';
    else if (normalizedInput.includes('hello') || normalizedInput.includes('hi')) currentIntent = 'greeting';
    else if (normalizedInput.includes('bye')) currentIntent = 'bye';
    else if (normalizedInput.includes('thank')) currentIntent = 'thanks';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: normalizedInput, lastIntent })
      });
      const data = await res.json();
      const botMessage = { text: data.reply, sender: 'bot', explanation: data.explanation };
      setMessages(prev => [...prev, botMessage]);

      // Update last intent
      setLastIntent(currentIntent);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = { text: 'Sorry, something went wrong.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {!isOpen && (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <img src={require('../assets/chatbot-icon.jpg')} alt="Chatbot" />
        </div>
      )}
      {isOpen && (
        <div className="chatbot">
          <div className="chat-header">
            <button onClick={clearMessages} className="clear-btn">Clear</button>
            <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
          </div>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
                {msg.sender === 'bot' && msg.explanation && (
                  <div>
                    <button onClick={() => toggleExplanation(index)} className="explanation-toggle">
                      {expandedExplanations.has(index) ? 'Hide' : 'Show'} Explanation
                    </button>
                    {expandedExplanations.has(index) && (
                      <div className="explanation">
                        {msg.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

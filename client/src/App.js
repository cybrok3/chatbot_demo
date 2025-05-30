import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const fullPlaceholder = "Ask me about my skills, projects, etc.";
  const [placeholder, setPlaceholder] = useState("");
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [displayedReply, setDisplayedReply] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Dark mode starts ON, no toggle:
  const [darkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Typing animation for placeholder on load
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setPlaceholder(fullPlaceholder.slice(0, index));
      index++;
      if (index > fullPlaceholder.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!prompt.trim() || isTyping) return;

    // Add user message immediately
    setChatHistory(prev => [...prev, { user: prompt, bot: "" }]);
    setPrompt('');
    setIsTyping(true);

    // Fetch bot reply from server
    const res = await fetch('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    const fullReply = data.reply;

    // Animate bot reply typing
    let i = 0;
    setDisplayedReply('');
    const typingInterval = setInterval(() => {
      setDisplayedReply(prev => prev + fullReply[i]);
      i++;
      if (i >= fullReply.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
        // Update chat history with full reply
        setChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1].bot = fullReply;
          return updated;
        });
        setDisplayedReply('');
      }
    }, 30);
  };

  const suggestions = [
  "Tell me about yourself",
  "What projects have you worked on ?",
  "What are your skills ?",
  "Where did you study ?",
  "What are your hobbies ?"
  ];  

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {/* No toggle button */}

      <h1>🤖Chatty_bot</h1>

      <div className="chat-history">
        {chatHistory.map((entry, index) => (
          <div key={index} className="message">
            <p className="user-msg"><strong>You:</strong> {entry.user}</p>
            <p className="bot-msg">
              <strong>Bot:</strong> {
                index === chatHistory.length - 1 && isTyping
                  ? displayedReply
                  : entry.bot
              }
            </p>
            <hr />
          </div>
        ))}
      </div>

      <input
        type="text"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        placeholder={placeholder}
        disabled={isTyping}
      />
      <button
        onClick={handleSend}
        disabled={isTyping}
      >
        Send
      </button>

        <div className="suggestions-container">
          {suggestions.map((text, idx) => (
            <button
              key={idx}
              className="suggestion-btn"
              onClick={() => handleSuggestionClick(text)}
              disabled={isTyping}
            >
              {text}
            </button>
          ))}
        </div>
    </div>
  );
}

export default App;

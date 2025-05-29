import React, {useState} from 'react';

function App(){

  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async () => {
  if (!prompt.trim()) return;

  const res = await fetch('/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({prompt}),
  });

  const data = await res.json();
  const botReply = data.reply;

  setChatHistory(prev => [...prev, { user: prompt, bot: botReply }]);
  setPrompt('');

  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>💼 Resume Chatbot</h1>

      <div style={{ marginBottom: '1rem' }}>
        {chatHistory.map((entry, index) => (
          <div key={index}>
            <p><strong>You:</strong> {entry.user}</p>
            <p><strong>Bot:</strong> {entry.bot}</p>
            <hr />
          </div>
        ))}
      </div>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
        placeholder="Ask me about my skills, projects, etc."
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={handleSend} style={{ padding: '0.5rem' }}>
        Send
      </button>
    </div>
  );
}

export default App;
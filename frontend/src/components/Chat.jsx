import React, { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [docId, setDocId] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() || !docId) return;
    const userMessage = { from: 'user', text: input };
    setMessages(m => [...m, userMessage]);
    setTyping(true);
    const form = new FormData();
    form.append('doc_id', docId);
    form.append('message', input);
    try {
      const res = await fetch('/chat', { method: 'POST', body: form });
      const data = await res.json();
      setMessages(m => [...m, { from: 'bot', text: data.answer }]);
    } catch (e) {
      setMessages(m => [...m, { from: 'bot', text: 'Error contacting server' }]);
    }
    setInput('');
    setTyping(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/upload', { method: 'POST', body: form });
    const data = await res.json();
    setDocId(data.doc_id);
    setMessages([]);
  };

  return (
    <div className="chat">
      <input type="file" onChange={handleFile} />
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.from}>{m.text}</div>
        ))}
      </div>
      {typing && <div className="typing">Assistant is typing...</div>}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

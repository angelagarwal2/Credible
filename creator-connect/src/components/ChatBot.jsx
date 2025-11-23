import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Sparkles } from 'lucide-react';

// --- FULL KNOWLEDGE BASE FROM YOUR CODE ---
const KNOWLEDGE_BASE = [
  { intent: "greeting", patterns: ["hi", "hello", "hey", "hola", "namaste"], response: "Hey creator 👋 I’m the Credible assistant. Ask me about pricing, verification, rankings or brand tools." },
  { intent: "pricing", patterns: ["price", "pricing", "cost", "paid plan", "subscription", "charges", "how much"], response: "Credible offers a free tier plus Pro and Elite plans. Pro is meant for serious micro-creators, and Elite unlocks advanced analytics, priority ranking, and deeper brand access." },
  { intent: "verification", patterns: ["verify", "verification", "badge", "blue tick", "get verified", "trusted"], response: "To get verified, you connect your platforms. Our system checks your bio for a unique code. Once confirmed, you get the Blue Tick." },
  { intent: "ranking", patterns: ["ranking", "leaderboard", "score", "position", "weekly rank"], response: "Credible shows weekly and overall rankings per creator role, based on engagement quality and growth trends — not just follower count." },
  { intent: "brand_dashboard", patterns: ["brand dashboard", "for brands", "agency", "discover creators"], response: "Brands can filter creators by niche, follower band, location, and authenticity score to manage outreach." },
  { intent: "data_privacy", patterns: ["data privacy", "safe", "secure", "dpdpa", "my data"], response: "Credible is DPDPA-aware. We plan to keep all Indian user data on regional servers and give you granular privacy controls." },
  { intent: "not_sure", patterns: [], response: "I’m not fully sure about that yet, but Credible focuses on verified creator identity. Try asking about pricing, verification, or rankings." },
];

const QUICK_QUESTIONS = [
  "How do I get verified?",
  "What are the plans?", 
  "How does ranking work?",
  "Is my data safe?"
];

function findBestResponse(userText) {
  const text = (userText || "").toLowerCase().trim();
  if (!text) return null;
  
  let bestMatch = null;
  let bestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const pattern of item.patterns) {
      if (text.includes(pattern)) score += pattern.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item.response;
    }
  }
  return bestMatch || KNOWLEDGE_BASE.find(k => k.intent === "not_sure").response;
}

export default function ChatBot() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: "Hi! Ask me anything about Credible." }]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput("");
    setTimeout(() => {
      const reply = findBestResponse(text);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
  };

  return (
    <div className="page-wrapper-chat">
      {/* INFO PANEL */}
      <div className="info-panel">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fffbeb', color: '#b45309', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '16px', border:'1px solid #fcd34d' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></div>
          Credible AI Assistant
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--dark)' }}>Your Personal<br/>Creator Guide.</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.95rem' }}>
          Ask anything about pricing, verification, collabs, or how we calculate trust scores.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#374151', display:'flex', flexDirection:'column', gap:12 }}>
          <li style={{display:'flex', alignItems:'center', gap:10}}><Sparkles size={16} color="#d97706"/> <strong>Multi-platform Identity</strong></li>
          <li style={{display:'flex', alignItems:'center', gap:10}}><Sparkles size={16} color="#d97706"/> <strong>Career-first Feed</strong></li>
          <li style={{display:'flex', alignItems:'center', gap:10}}><Sparkles size={16} color="#d97706"/> <strong>DPDPA Compliant</strong></li>
        </ul>
      </div>

      {/* CHAT BOX */}
      <div className="chat-wrapper">
        <div className="chat-header">
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <div className="bot-avatar">C</div>
            <div>
              <div style={{fontWeight:700, fontSize:'1rem'}}>Credible Support</div>
              <div style={{fontSize:'0.8rem', opacity: 0.8}}>Online • JSON Powered</div>
            </div>
          </div>
          <MessageCircle size={24} />
        </div>

        <div className="chat-body">
          {messages.map((m, i) => (
            <div key={i} className={`message-row ${m.sender}`}>
              <div className={`message ${m.sender}`}>{m.text}</div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>

        <div className="chat-footer-container">
          <div className="suggestions">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => handleSend(q)} className="suggestion-pill">{q}</button>
            ))}
          </div>

          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
            <input className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." />
            <button style={{color:'white'}} type="submit" className="send-btn"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
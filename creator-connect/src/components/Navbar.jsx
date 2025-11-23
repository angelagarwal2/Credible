import React from 'react';
import { Sun, LogOut } from 'lucide-react';

export default function Navbar({ user, handleLogout, setView }) {
  return (
    <nav className="navbar">
      <div 
        className="nav-brand" 
        onClick={() => setView(user ? 'dashboard' : 'landing')} 
        style={{ cursor: 'pointer' }}
      >
        <Sun size={24} color="var(--primary)" fill="var(--primary)" />
        <span>Credible</span>
        <span className="beta-badge">BETA</span>
      </div>

      <div className="nav-desktop">
        {!user ? (
          <>
            <button onClick={() => document.getElementById('problem').scrollIntoView()} className="nav-link" style={{background:'none', border:'none', cursor:'pointer'}}>Problem</button>
            <button onClick={() => setView('login')} className="nav-link" style={{background:'none', border:'none', cursor:'pointer'}}>Login</button>
            <button onClick={() => setView('signup-choice')} className="btn btn-primary" style={{padding:'0.5rem 1.5rem', fontSize:'0.9rem'}}>
              Sign Up
            </button>
          </>
        ) : (
          <button onClick={handleLogout} className="btn btn-ghost" style={{padding:'0.5rem 1.2rem', fontSize:'0.9rem'}}>
            <LogOut size={16} /> Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
import React from 'react';
import { Video, Briefcase } from 'lucide-react';

export default function SignupChoice({ setView }) {
  return (
    <div className="text-center">
      <h2 className="mb-6" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Join the Network</h2>
      <p className="mb-6" style={{ color: '#666' }}>Select your primary role to get started</p>
      
      <div onClick={() => setView('signup-creator')} className="choice-card">
        <div className="icon-circle icon-blue"><Video size={28} /></div>
        <div>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>I am a Content Creator</h3>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Showcase portfolio, join leaderboard & get deals.</p>
        </div>
      </div>

      <div onClick={() => setView('signup-brand')} className="choice-card">
        <div className="icon-circle icon-amber"><Briefcase size={28} /></div>
        <div>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>I am a Brand / Agency</h3>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Discover talent, view analytics & collaborate.</p>
        </div>
      </div>

      <button onClick={() => setView('login')} className="btn-link mt-4">
        Already have an account? Login
      </button>
    </div>
  );
}
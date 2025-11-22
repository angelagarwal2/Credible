import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Loader2, ArrowLeft, KeyRound } from 'lucide-react';

export default function Login({ setView }) {
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Invalid email or password.');
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setIsSubmitting(false);
    } catch (err) {
      setError('Failed to send reset email. Please check the address.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      {mode === 'login' && (
        <>
          <div className="text-center mb-6">
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>Welcome Back</h2>
            <p style={{ color: '#666' }}>Login to access your professional hub</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className="form-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="form-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}

            <button disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Login'}
            </button>
          </form>

          {/* --- Reorganized Links Section --- */}
          <div className="mt-6">
            {/* 1. Sign Up Link (Top) */}
            <div className="text-center mb-4">
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, alignItems: 'center' }}>
                Don't have an account? <button onClick={() => setView('signup-choice')} className="btn-link">Sign Up</button>
              </p>
            </div>

            {/* 2. Forgot Password Link (Bottom) */}
            <div className="text-center" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
              <button 
                onClick={() => { setMode('reset'); setError(''); setMessage(''); }}
                className="btn-link"
                style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-muted)', 
                  fontWeight: 'normal',
                }}
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </>
      )}

      {mode === 'reset' && (
        <>
          <button 
            onClick={() => { setMode('login'); setError(''); setMessage(''); }} 
            className="btn-link mb-4" 
            style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px'}}
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
          
          <div className="text-center mb-6">
            <div style={{ width: '50px', height: '50px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#2563eb' }}>
              <KeyRound size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>Reset Password</h2>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Enter your email and we'll send you a link to reset your password.</p>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className="form-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email"/>
            </div>
            {message && <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.9rem' }}>{message}</div>}
            {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', fontSize: '0.9rem' }}>{error}</div>}
            <button disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
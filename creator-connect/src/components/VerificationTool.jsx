import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Activity, BarChart2, Lock, 
  Instagram, CheckCircle, ArrowRight, Fingerprint, Loader2
} from 'lucide-react';

// NOTE: Since we don't have the backend running, we will mock the response
// but keep the structure ready for axios.
// import axios from 'axios'; 
// const API_URL = 'http://localhost:5000/api/analyze/verify';

export default function VerificationTool({ onClose }) {
  // VIEW STATE: 'input' | 'loading' | 'report'
  const [step, setStep] = useState('input');
  
  // FORM STATE
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // --- ACTION: VERIFY CREATOR ---
  const handleVerification = async (e) => {
    e.preventDefault();
    if(!username || !password) {
        setError("Please enter both ID and Password.");
        return;
    }

    setStep('loading');
    setError('');

    // SIMULATED API CALL (Replace with axios when backend is ready)
    setTimeout(() => {
        // Mock Success Response
        const mockResponse = {
            username: username,
            trustScore: 88,
            trustTier: 'Authentic',
            forensics: {
                mathematical_integrity: 94,
                behavioral_humanity: 82,
                content_quality: 89
            },
            redFlags: [] 
            // For testing red flags, uncomment below:
            // redFlags: ["Sudden follower spike detected", "Low engagement ratio"]
        };
        setResult(mockResponse);
        setStep('report');
    }, 2000);
  };

  // --- THEME HELPERS ---
  const isTrusted = result && result.trustScore > 70;
  const themeColor = result ? (result.trustScore < 50 ? 'red' : (result.trustScore < 75 ? 'orange' : 'green')) : 'gray';

  return (
    <div>
      {/* ---------------- VIEW 1: INPUT FORM ---------------- */}
      {step === 'input' && (
        <div className="animate-fade">
            <div className="insta-icon-wrapper">
                <Instagram size={32} color="white" />
            </div>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <h2 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Connect Identity</h2>
                <p style={{color: '#6b7280', fontSize: '0.9rem'}}>Securely link your Instagram to initiate the forensic scan.</p>
            </div>

            <form onSubmit={handleVerification} className="login-form">
                <div className="input-group">
                    <label className="input-label">Instagram Username</label>
                    <input 
                        className="form-input"
                        type="text" 
                        placeholder="@username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                
                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input 
                        className="form-input"
                        type="password" 
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <small className="security-note">
                        <Lock size={12}/> Info used for verification only. Never stored.
                    </small>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <button type="submit" className="verify-submit-btn">
                    Verify Identity
                </button>
            </form>
        </div>
      )}

      {/* ---------------- VIEW 2: LOADING ---------------- */}
      {step === 'loading' && (
          <div style={{padding: '3rem', textAlign: 'center'}}>
              <Loader2 size={48} className="animate-spin" color="var(--primary)" style={{margin: '0 auto 1rem'}} />
              <h3>Scanning Forensics...</h3>
              <p style={{color: '#6b7280'}}>Analyzing Benford's Law & Bot Patterns</p>
          </div>
      )}

      {/* ---------------- VIEW 3: REPORT DASHBOARD ---------------- */}
      {step === 'report' && result && (
        <div className="animate-fade">
            <div className={`status-bar bar-${themeColor}`}></div>
            <div style={{padding: '0 1rem'}}>
                <div className="card-header" style={{marginBottom: '1rem'}}>
                    <div>
                        <span className="username">@{result.username}</span>
                        <span className="niche-tag">Verified Creator</span>
                    </div>
                    <div className={`badge bg-${themeColor} text-${themeColor}`}>
                        {isTrusted ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                        {result.trustTier}
                    </div>
                </div>

                <div className="score-section">
                    <div className={`big-score text-${themeColor}`}>{result.trustScore}</div>
                    <div className="score-label">Global Trust Score</div>
                </div>

                <div className="grid">
                    <div className="stat-box">
                        <BarChart2 size={20} color="#9ca3af" />
                        <span className="stat-value">{result.forensics.mathematical_integrity}/100</span>
                        <span className="stat-label">Math</span>
                    </div>
                    <div className="stat-box">
                        <Activity size={20} color="#9ca3af" />
                        <span className="stat-value">{result.forensics.behavioral_humanity}/100</span>
                        <span className="stat-label">Humanity</span>
                    </div>
                    <div className="stat-box">
                        <Lock size={20} color="#9ca3af" />
                        <span className="stat-value">{result.forensics.content_quality}/100</span>
                        <span className="stat-label">Content</span>
                    </div>
                </div>

                {result.redFlags.length > 0 && (
                    <div className="red-flags">
                        <strong>⚠️ Anomalies Detected:</strong>
                        <ul>{result.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}</ul>
                    </div>
                )}

                <button className="btn-reset" onClick={onClose}>
                    Done
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
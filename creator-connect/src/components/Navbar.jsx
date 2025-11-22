import React from 'react';
import { Hexagon, LogOut } from 'lucide-react';

export default function Navbar({ user, handleLogout }) {
  return (
    <nav className="navbar">
      {/* Updated Brand Name and Icon */}
      <div className="nav-brand">
        <Hexagon size={28} strokeWidth={2.5} />
        <span>Credible</span>
      </div>
      
      {user && (
        <button onClick={handleLogout} className="btn btn-ghost">
          <LogOut size={18} /> 
          <span style={{marginLeft: '8px'}}>Sign Out</span>
        </button>
      )}
    </nav>
  );
}
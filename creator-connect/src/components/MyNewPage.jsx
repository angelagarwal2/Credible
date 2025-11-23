import React from 'react';

export default function MyNewPage() {
  return (
    <div className="card text-center" style={{ marginTop: '4rem' }}>
      <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Welcome to My New Page</h1>
      <p style={{ color: '#666' }}>This content is visible only after login.</p>
    </div>
  );
}
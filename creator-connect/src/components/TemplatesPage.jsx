
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Download, Play, Layers, Loader2, Music, Video, X, CheckCircle, Share2, Type, Lock } from 'lucide-react';

export default function TemplatesPage({ setView, userData, addPost, isPremium }) {
  const [activeTab, setActiveTab] = useState('reels');
  const [memeTemplates, setMemeTemplates] = useState([]);
  const [videoTemplates, setVideoTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        if (data.success) setMemeTemplates(data.data.memes.slice(0, 20));
      } catch (error) { console.error("Failed to fetch memes:", error); }
    };

    const fetchVideoTrends = () => {
      const trends = [
        { id: 1, title: "The 'Glitch' Transition", category: "Tech/Vlog", views: "2.4M", difficulty: "Medium", audio: "Cyberpunk Beat", desc: "Fast cuts matched to bass drops.", color: "#4f46e5" },
        { id: 2, title: "POV: You work at...", category: "Career", views: "850K", difficulty: "Easy", audio: "Office Lo-Fi", desc: "Static camera, text overlay bubbles.", color: "#0ea5e9" },
        { id: 3, title: "Day in 7 Seconds", category: "Lifestyle", views: "5.1M", difficulty: "Hard", audio: "Sped Up Vocals", desc: "Hyper-lapse of your entire day.", color: "#f43f5e" },
        { id: 4, title: "3 Tools You Need", category: "Education", views: "1.2M", difficulty: "Easy", audio: "Motivational Speech", desc: "Green screen background with tool screenshots.", color: "#10b981" },
      ];
      setVideoTemplates(trends);
    };

    Promise.all([fetchMemes(), fetchVideoTrends()]).then(() => setLoading(false));
  }, []);

  const handlePublish = () => {
    if (!editCaption) return;
    setIsPublishing(true);
    const newPost = {
      id: Date.now(), author: userData.fullName || "You", avatar: (userData.fullName || "Y")[0],
      content: `Used the "${editingTemplate.title}" template! 🎥 \n\n"${editCaption}"`,
      time: "Just now", likes: 0, comments: 0, templateUsed: editingTemplate.title
    };
    setTimeout(() => { addPost(newPost); setIsPublishing(false); setEditingTemplate(null); setEditCaption(""); setView('dashboard'); }, 1500);
  };

  return (
    <div className="animate-fade" style={{ paddingBottom: '40px', position: 'relative' }}>
      
      {/* --- PAYWALL OVERLAY --- */}
      {!isPremium && (
        <div style={{ 
          position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 50, 
          backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
        }}>
          <div className="card" style={{ maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <Lock size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>Premium Feature</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Unlock access to trending Reel templates, memes, and the video editor studio.
            </p>
            <button onClick={() => setView('dashboard')} className="btn btn-primary" style={{ width: '100%' }}>
              Go Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => setView('dashboard')} className="btn-ghost" style={{ borderRadius: '50%', width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={24} /></button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, marginBottom: '4px', color: 'var(--dark)' }}>Creator Templates</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Trending formats to boost engagement.</p>
        </div>
      </div>

      {/* TABS & CONTENT (Same as before) */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '1px' }}>
        <button onClick={() => setActiveTab('reels')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'reels' ? '3px solid var(--primary)' : '3px solid transparent', fontWeight: 700, color: activeTab === 'reels' ? 'var(--dark)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Play size={18} /> Reel Trends</button>
        <button onClick={() => setActiveTab('memes')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'memes' ? '3px solid var(--primary)' : '3px solid transparent', fontWeight: 700, color: activeTab === 'memes' ? 'var(--dark)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={18} /> Meme Templates</button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} /><p style={{ color: 'var(--text-muted)' }}>Fetching latest trends...</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {activeTab === 'reels' && videoTemplates.map((item) => (
            <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: item.color, padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px', position: 'relative' }}>
                <Play size={40} fill="white" style={{ opacity: 0.9 }} />
                <div style={{ marginTop: '12px', fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>{item.views} Uses</div>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="tag">{item.category}</span>
                  <span className="tag">{item.difficulty}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}><Music size={14} /> {item.audio}</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '20px', flex: 1 }}>{item.desc}</p>
                <button onClick={() => setEditingTemplate(item)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', background: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}><Video size={16} /> Use This Template</button>
              </div>
            </div>
          ))}
          {activeTab === 'memes' && memeTemplates.map((meme) => (
            <div key={meme.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '250px', overflow: 'hidden', background: '#f1f5f9' }}><img src={meme.url} alt={meme.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meme.name}</h3>
                <button className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}><Download size={16} style={{ marginRight: 6 }} /> Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- VIDEO EDITOR MODAL --- */}
      {editingTemplate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '900px', height: '80vh', display: 'grid', gridTemplateColumns: '2fr 1fr', overflow: 'hidden' }}>
            <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ color: 'white', textAlign: 'center' }}>
                <div style={{ width: '280px', height: '500px', background: editingTemplate.color, borderRadius: '12px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{position: 'absolute', inset: 0, opacity: 0.3, background: 'linear-gradient(45deg, #000, transparent)'}}></div>
                  <h2 style={{color:'white', fontSize: '2rem', fontWeight: 900, zIndex: 10, padding: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{editCaption || "Your Text Here"}</h2>
                  <div style={{position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 8, alignItems: 'center', color: 'white', fontSize: '0.8rem'}}><Music size={14} /> {editingTemplate.audio}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                <h3 style={{margin: 0, fontSize: '1.2rem', fontWeight: 800}}>Remix Template</h3>
                <button onClick={() => setEditingTemplate(null)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><X size={24} color="var(--text-muted)"/></button>
              </div>
              <div style={{marginBottom: '24px'}}><label className="input-label">Selected Template</label><div style={{padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10}}><div style={{width: 24, height: 24, borderRadius: 4, background: editingTemplate.color}}></div>{editingTemplate.title}</div></div>
              <div style={{marginBottom: '24px', flex: 1}}><label className="input-label">Add Overlay Text</label><textarea className="form-input" rows="4" placeholder="Type something catchy..." value={editCaption} onChange={(e) => setEditCaption(e.target.value)} style={{ fontSize: '1.1rem' }}></textarea><div style={{marginTop: 8, display: 'flex', gap: 8}}><button className="btn-ghost" style={{padding: '6px 12px', fontSize: '0.8rem'}}><Type size={14}/> Font</button><button className="btn-ghost" style={{padding: '6px 12px', fontSize: '0.8rem'}}><Music size={14}/> Change Audio</button></div></div>
              <button onClick={handlePublish} disabled={!editCaption || isPublishing} className="btn btn-primary" style={{width: '100%', padding: '1rem', fontSize: '1rem'}}>{isPublishing ? <Loader2 className="animate-spin" /> : <Share2 size={18} />} {isPublishing ? "Publishing..." : "Share to Feed"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Zap, Download, Play, Layers, Loader2, Music, Video, X, CheckCircle, Share2, Type } from 'lucide-react';

// export default function TemplatesPage({ setView, userData, addPost }) {
//   const [activeTab, setActiveTab] = useState('reels');
//   const [memeTemplates, setMemeTemplates] = useState([]);
//   const [videoTemplates, setVideoTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- EDITOR STATE ---
//   const [editingTemplate, setEditingTemplate] = useState(null); // The template being edited
//   const [editCaption, setEditCaption] = useState(""); // User's overlay text
//   const [isPublishing, setIsPublishing] = useState(false);

//   useEffect(() => {
//     const fetchMemes = async () => {
//       try {
//         const response = await fetch('https://api.imgflip.com/get_memes');
//         const data = await response.json();
//         if (data.success) setMemeTemplates(data.data.memes.slice(0, 20));
//       } catch (error) {
//         console.error("Failed to fetch memes:", error);
//       }
//     };

//     const fetchVideoTrends = () => {
//       const trends = [
//         { id: 1, title: "The 'Glitch' Transition", category: "Tech/Vlog", views: "2.4M", difficulty: "Medium", audio: "Cyberpunk Beat", desc: "Fast cuts matched to bass drops.", color: "#4f46e5" },
//         { id: 2, title: "POV: You work at...", category: "Career", views: "850K", difficulty: "Easy", audio: "Office Lo-Fi", desc: "Static camera, text overlay bubbles.", color: "#0ea5e9" },
//         { id: 3, title: "Day in 7 Seconds", category: "Lifestyle", views: "5.1M", difficulty: "Hard", audio: "Sped Up Vocals", desc: "Hyper-lapse of your entire day.", color: "#f43f5e" },
//         { id: 4, title: "3 Tools You Need", category: "Education", views: "1.2M", difficulty: "Easy", audio: "Motivational Speech", desc: "Green screen background with tool screenshots.", color: "#10b981" },
//       ];
//       setVideoTemplates(trends);
//     };

//     Promise.all([fetchMemes(), fetchVideoTrends()]).then(() => setLoading(false));
//   }, []);

//   // --- HANDLE PUBLISH TO FEED ---
//   const handlePublish = () => {
//     if (!editCaption) return;
//     setIsPublishing(true);

//     const newPost = {
//       id: Date.now(),
//       author: userData.fullName || "You",
//       avatar: (userData.fullName || "Y")[0],
//       content: `Used the "${editingTemplate.title}" template! 🎥 \n\n"${editCaption}"`,
//       time: "Just now",
//       likes: 0,
//       comments: 0,
//       isRichMedia: true, // Flag to render differently if needed
//       templateUsed: editingTemplate.title
//     };

//     setTimeout(() => {
//       addPost(newPost); // Add to global feed
//       setIsPublishing(false);
//       setEditingTemplate(null);
//       setEditCaption("");
//       setView('dashboard'); // Redirect user to see their post
//     }, 1500);
//   };

//   return (
//     <div className="animate-fade" style={{ paddingBottom: '40px' }}>
      
//       {/* HEADER */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
//         <button onClick={() => setView('dashboard')} className="btn-ghost" style={{ borderRadius: '50%', width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={24} /></button>
//         <div>
//           <h1 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, marginBottom: '4px', color: 'var(--dark)' }}>Creator Templates</h1>
//           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Trending formats to boost engagement.</p>
//         </div>
//       </div>

//       {/* TABS */}
//       <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '1px' }}>
//         <button onClick={() => setActiveTab('reels')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'reels' ? '3px solid var(--primary)' : '3px solid transparent', fontWeight: 700, color: activeTab === 'reels' ? 'var(--dark)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Play size={18} /> Reel Trends</button>
//         <button onClick={() => setActiveTab('memes')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'memes' ? '3px solid var(--primary)' : '3px solid transparent', fontWeight: 700, color: activeTab === 'memes' ? 'var(--dark)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={18} /> Meme Templates</button>
//       </div>

//       {/* TEMPLATES GRID */}
//       {loading ? (
//         <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} /><p style={{ color: 'var(--text-muted)' }}>Fetching latest trends...</p></div>
//       ) : (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          
//           {activeTab === 'reels' && videoTemplates.map((item) => (
//             <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
//               <div style={{ background: item.color, padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px', position: 'relative' }}>
//                 <Play size={40} fill="white" style={{ opacity: 0.9 }} />
//                 <div style={{ marginTop: '12px', fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</div>
//                 <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>{item.views} Uses</div>
//               </div>
//               <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
//                   <span className="tag">{item.category}</span>
//                   <span className="tag">{item.difficulty}</span>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}><Music size={14} /> {item.audio}</div>
//                 <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '20px', flex: 1 }}>{item.desc}</p>
                
//                 {/* OPEN EDITOR BUTTON */}
//                 <button 
//                   onClick={() => setEditingTemplate(item)}
//                   className="btn btn-ghost" 
//                   style={{ width: '100%', justifyContent: 'center', background: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}
//                 >
//                   <Video size={16} /> Use This Template
//                 </button>
//               </div>
//             </div>
//           ))}

//           {activeTab === 'memes' && memeTemplates.map((meme) => (
//             <div key={meme.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
//               <div style={{ height: '250px', overflow: 'hidden', background: '#f1f5f9' }}>
//                 <img src={meme.url} alt={meme.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               </div>
//               <div style={{ padding: '16px' }}>
//                 <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meme.name}</h3>
//                 <button className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}><Download size={16} style={{ marginRight: 6 }} /> Download</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* --- VIDEO EDITOR MODAL (The "Studio") --- */}
//       {editingTemplate && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
//           <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '900px', height: '80vh', display: 'grid', gridTemplateColumns: '2fr 1fr', overflow: 'hidden' }}>
            
//             {/* Left: Preview Area */}
//             <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
//               <div style={{ color: 'white', textAlign: 'center' }}>
//                 <div style={{ width: '280px', height: '500px', background: editingTemplate.color, borderRadius: '12px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
//                   {/* Simulated Video Content */}
//                   <div style={{position: 'absolute', inset: 0, opacity: 0.3, background: 'linear-gradient(45deg, #000, transparent)'}}></div>
//                   <h2 style={{color:'white', fontSize: '2rem', fontWeight: 900, zIndex: 10, padding: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
//                     {editCaption || "Your Text Here"}
//                   </h2>
//                   <div style={{position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 8, alignItems: 'center', color: 'white', fontSize: '0.8rem'}}>
//                     <Music size={14} /> {editingTemplate.audio}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Controls */}
//             <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
//               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
//                 <h3 style={{margin: 0, fontSize: '1.2rem', fontWeight: 800}}>Remix Template</h3>
//                 <button onClick={() => setEditingTemplate(null)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><X size={24} color="var(--text-muted)"/></button>
//               </div>

//               <div style={{marginBottom: '24px'}}>
//                 <label className="input-label">Selected Template</label>
//                 <div style={{padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10}}>
//                   <div style={{width: 24, height: 24, borderRadius: 4, background: editingTemplate.color}}></div>
//                   {editingTemplate.title}
//                 </div>
//               </div>

//               <div style={{marginBottom: '24px', flex: 1}}>
//                 <label className="input-label">Add Overlay Text</label>
//                 <textarea 
//                   className="form-input" 
//                   rows="4" 
//                   placeholder="Type something catchy..."
//                   value={editCaption}
//                   onChange={(e) => setEditCaption(e.target.value)}
//                   style={{ fontSize: '1.1rem' }}
//                 ></textarea>
//                 <div style={{marginTop: 8, display: 'flex', gap: 8}}>
//                   <button className="btn-ghost" style={{padding: '6px 12px', fontSize: '0.8rem'}}><Type size={14}/> Font</button>
//                   <button className="btn-ghost" style={{padding: '6px 12px', fontSize: '0.8rem'}}><Music size={14}/> Change Audio</button>
//                 </div>
//               </div>

//               <button 
//                 onClick={handlePublish}
//                 disabled={!editCaption || isPublishing}
//                 className="btn btn-primary" 
//                 style={{width: '100%', padding: '1rem', fontSize: '1rem'}}
//               >
//                 {isPublishing ? <Loader2 className="animate-spin" /> : <Share2 size={18} />} 
//                 {isPublishing ? "Publishing..." : "Share to Feed"}
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
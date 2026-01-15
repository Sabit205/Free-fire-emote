import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { ref, push, remove, onValue, set } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, Plus, Edit2, Shield, Gamepad2, Layers } from 'lucide-react';

export default function AdminDashboard() {
    const [emotes, setEmotes] = useState({});
    const [servers, setServers] = useState({});
    const [categories, setCategories] = useState({});

    // Form States
    const [emoteForm, setEmoteForm] = useState({ id: null, itemId: '', name: '', category: '' });
    const [serverForm, setServerForm] = useState({ id: null, name: '', baseUrl: '' });
    const [categoryName, setCategoryName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        onValue(ref(db, 'emotes'), (snap) => setEmotes(snap.val() || {}));
        onValue(ref(db, 'servers'), (snap) => setServers(snap.val() || {}));
        onValue(ref(db, 'categories'), (snap) => setCategories(snap.val() || {}));
    }, []);

    // --- Actions ---
    const handleAddCategory = () => {
        if (!categoryName) return;
        push(ref(db, 'categories'), { name: categoryName });
        setCategoryName('');
    };

    const handleDeleteCategory = (key) => {
        if (window.confirm('Delete this category?')) remove(ref(db, `categories/${key}`));
    };

    const handleSaveEmote = () => {
        if (!emoteForm.itemId || !emoteForm.name) return;
        const data = { itemId: emoteForm.itemId, name: emoteForm.name, category: emoteForm.category || '' };
        if (emoteForm.id) set(ref(db, `emotes/${emoteForm.id}`), data);
        else push(ref(db, 'emotes'), data);
        setEmoteForm({ id: null, itemId: '', name: '', category: '' });
    };

    const handleSaveServer = () => {
        if (!serverForm.name || !serverForm.baseUrl) return;
        const data = { name: serverForm.name, baseUrl: serverForm.baseUrl };
        if (serverForm.id) set(ref(db, `servers/${serverForm.id}`), data);
        else push(ref(db, 'servers'), data);
        setServerForm({ id: null, name: '', baseUrl: '' });
    };

    return (
        <div className="container">
            {/* Header */}
            <div className="flex justify-between items-center mb-4" style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your game assets and configurations.</p>
                </div>
                <button onClick={() => { signOut(auth); navigate('/admin'); }} className="btn btn-secondary">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="grid grid-dashboard" style={{ gridTemplateColumns: '300px 1fr 350px', gap: '2rem', alignItems: 'start' }}>

                {/* --- Column 1: Categories (Smallest) --- */}
                <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3><Layers size={18} style={{ display: 'inline', marginRight: '8px' }} /> Categories</h3>
                        </div>
                        <div className="flex gap-2">
                            <input
                                placeholder="New Category..."
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                            <button onClick={handleAddCategory} className="btn btn-primary btn-icon"><Plus size={18} /></button>
                        </div>
                    </div>

                    <div className="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                        {Object.entries(categories).map(([key, cat]) => (
                            <div key={key} className="card flex justify-between items-center" style={{ padding: '1rem' }}>
                                <span style={{ fontWeight: 500 }}>{cat.name}</span>
                                <button onClick={() => handleDeleteCategory(key)} className="btn btn-danger btn-icon">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Column 2: Emotes (Main Content) --- */}
                <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h3><Gamepad2 size={18} style={{ display: 'inline', marginRight: '8px' }} /> {emoteForm.id ? 'Edit Emote' : 'Add New Emote'}</h3>

                        <div className="grid grid-cols-2" style={{ gap: '1rem', alignItems: 'start' }}>
                            <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                                <input placeholder="Item ID (e.g. 12345)" value={emoteForm.itemId} onChange={(e) => setEmoteForm({ ...emoteForm, itemId: e.target.value })} />
                                <input placeholder="Emote Name" value={emoteForm.name} onChange={(e) => setEmoteForm({ ...emoteForm, name: e.target.value })} />
                                <select value={emoteForm.category} onChange={(e) => setEmoteForm({ ...emoteForm, category: e.target.value })}>
                                    <option value="">Select Category...</option>
                                    {Object.entries(categories).map(([key, cat]) => <option key={key} value={cat.name}>{cat.name}</option>)}
                                </select>

                                <div className="flex gap-2 mt-4">
                                    <button onClick={handleSaveEmote} className="btn btn-primary w-full">
                                        {emoteForm.id ? 'Save Changes' : 'Add Emote'}
                                    </button>
                                    {emoteForm.id && (
                                        <button onClick={() => setEmoteForm({ id: null, itemId: '', name: '', category: '' })} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Preview Panel */}
                            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', border: '1px dashed var(--border)' }}>
                                {emoteForm.itemId ? (
                                    <>
                                        <img
                                            src={`https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/${emoteForm.itemId}.png`}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '1rem' }}
                                            onError={(e) => e.target.style.opacity = 0.2}
                                        />
                                        <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>Preview</span>
                                    </>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Enter Item ID to preview</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-auto" style={{ gap: '1rem' }}>
                        {Object.entries(emotes).map(([key, emote]) => (
                            <div key={key} className="card" style={{ padding: '1rem', position: 'relative' }}>
                                <div className="flex items-center gap-4">
                                    <div style={{ width: '50px', height: '50px', background: '#000', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <img src={`https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/${emote.itemId}.png`} alt={emote.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emote.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {emote.itemId}</div>
                                        {emote.category && <div className="badge badge-outline" style={{ marginTop: '4px', display: 'inline-block' }}>{emote.category}</div>}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => setEmoteForm({ id: key, ...emote })} className="btn btn-secondary btn-sm w-full"><Edit2 size={12} /> Edit</button>
                                    <button onClick={() => { if (window.confirm('Delete?')) remove(ref(db, `emotes/${key}`)) }} className="btn btn-danger btn-icon"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Column 3: Servers --- */}
                <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h3><Shield size={18} style={{ display: 'inline', marginRight: '8px' }} /> Servers</h3>
                        <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                            <input placeholder="Server Name" value={serverForm.name} onChange={(e) => setServerForm({ ...serverForm, name: e.target.value })} />
                            <input placeholder="Base URL" value={serverForm.baseUrl} onChange={(e) => setServerForm({ ...serverForm, baseUrl: e.target.value })} />
                            <div className="flex gap-2">
                                <button onClick={handleSaveServer} className="btn btn-primary w-full">
                                    {serverForm.id ? 'Save' : 'Add'}
                                </button>
                                {serverForm.id && <button onClick={() => setServerForm({ id: null, name: '', baseUrl: '' })} className="btn btn-secondary">Cancel</button>}
                            </div>
                        </div>
                    </div>

                    <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                        {Object.entries(servers).map(([key, server]) => (
                            <div key={key} className="card" style={{ padding: '1rem' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div style={{ fontWeight: 600 }}>{server.name}</div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setServerForm({ id: key, ...server })} className="btn btn-secondary btn-icon" style={{ padding: '4px' }}><Edit2 size={12} /></button>
                                        <button onClick={() => { if (window.confirm('Delete?')) remove(ref(db, `servers/${key}`)) }} className="btn btn-danger btn-icon" style={{ padding: '4px' }}><Trash2 size={12} /></button>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all', background: 'var(--bg-input)', padding: '6px', borderRadius: '4px' }}>
                                    {server.baseUrl}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Responsive Fix */}
            <style>{`
                @media (max-width: 1024px) {
                    .grid-dashboard { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Send, Server, User, Gamepad2, Shield } from 'lucide-react';
import './Home.css';

export default function Home() {
    const [servers, setServers] = useState({});
    const [emotes, setEmotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    // Filter emotes
    const filteredEmotes = activeCategory === 'All'
        ? emotes
        : Object.fromEntries(Object.entries(emotes).filter(([key, val]) => val.category === activeCategory));

    const [formData, setFormData] = useState({
        teamCode: '',
        uid: '',
        selectedServer: '',
        selectedEmoteId: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        // Load data from Firebase
        const serversRef = ref(db, 'servers');
        const emotesRef = ref(db, 'emotes');

        onValue(serversRef, (snapshot) => {
            setServers(snapshot.val() || {});
        });

        onValue(emotesRef, (snapshot) => {
            setEmotes(snapshot.val() || {});
            setLoading(false);
        });
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        // Check for required fields, including server selection
        if (!formData.teamCode || !formData.uid || !formData.selectedEmoteId || !formData.selectedServer) {
            setStatus({ type: 'error', msg: 'Please fill in all fields (Server, Emote, Team Code, UID).' });
            return;
        }

        const selectedServerObj = servers[formData.selectedServer];
        if (!selectedServerObj || !selectedServerObj.baseUrl) {
            setStatus({ type: 'error', msg: 'Selected server is invalid or missing Base URL.' });
            return;
        }

        setStatus({ type: 'loading', msg: 'Sending emote...' });

        // Clean base URL (remove trailing slash)
        const cleanBaseUrl = selectedServerObj.baseUrl.replace(/\/$/, '');
        // Construct the ACTUAL unsecured target URL
        const targetUrl = `${cleanBaseUrl}/join?tc=${formData.teamCode}&uid1=${formData.uid}&emote_id=${formData.selectedEmoteId}`;

        // Route through our secure Vercel proxy
        // Pass the target URL as a query parameter
        const proxyUrl = `/api/proxy?target=${encodeURIComponent(targetUrl)}`;

        try {
            await fetch(proxyUrl);
            setStatus({ type: 'success', msg: 'Emote request sent! Check game lobby.' });
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: 'Failed to send request.' });
        }
    };

    return (
        <div className="home-container">
            <div className="glass-overlay"></div>

            {/* Hero Section */}
            <div className="hero-section fade-in">
                <h1 className="title-glitch" data-text="FREE FIRE EMOTE">FREE FIRE EMOTE</h1>
                <p className="subtitle">DOMINATE THE LOBBY</p>
            </div>

            <div className="main-grid">
                {/* Left Panel - Inputs */}
                <div className="control-panel slide-in-left">
                    <div className="panel-header">
                        <User className="icon-pulse" /> PLAYER DETAILS
                    </div>

                    <div className="input-group">
                        <label>TEAM CODE</label>
                        <div className="input-wrapper">
                            <Gamepad2 size={18} />
                            <input
                                type="text"
                                placeholder="Ex: 1234567"
                                value={formData.teamCode}
                                onChange={(e) => setFormData({ ...formData, teamCode: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>PLAYER UID</label>
                        <div className="input-wrapper">
                            <Shield size={18} />
                            <input
                                type="text"
                                placeholder="Ex: 888999000"
                                value={formData.uid}
                                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>SERVER</label>
                        <div className="server-grid">
                            {Object.entries(servers).length === 0 ? (
                                <div className="empty-state">No servers available</div>
                            ) : (
                                Object.entries(servers).map(([key, server]) => (
                                    <button
                                        key={key}
                                        className={`server-chip ${formData.selectedServer === key ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, selectedServer: key })}
                                    >
                                        <Server size={14} /> {server.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <button
                        className="action-btn"
                        onClick={handleSend}
                        disabled={status.type === 'loading'}
                    >
                        {status.type === 'loading' ? 'SENDING...' : 'SEND EMOTE'} <Send size={18} />
                    </button>

                    {status.msg && (
                        <div className={`status-msg ${status.type}`}>
                            {status.msg}
                        </div>
                    )}
                </div>

                {/* Right Panel - Emotes Grid */}
                <div className="emote-panel slide-in-right">
                    <div className="panel-header">
                        <span style={{ color: 'var(--primary)' }}>★</span> SELECT EMOTE
                    </div>

                    {/* Category Tabs */}
                    <div className="category-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px', scrollbarWidth: 'none' }}>
                        <button
                            className={`server-chip ${activeCategory === 'All' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('All')}
                        >
                            All
                        </button>
                        {/* Derive unique categories from emotes */}
                        {[...new Set(Object.values(emotes).map(e => e.category).filter(Boolean))].map(cat => (
                            <button
                                key={cat}
                                className={`server-chip ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loader-container">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="emote-grid">
                            {Object.keys(filteredEmotes).length === 0 ? (
                                <div className="empty-state">No emotes found.</div>
                            ) : (
                                Object.entries(filteredEmotes).map(([key, emote]) => (
                                    <div
                                        key={key}
                                        className={`emote-card ${formData.selectedEmoteId === emote.itemId ? 'selected' : ''}`}
                                        onClick={() => setFormData({ ...formData, selectedEmoteId: emote.itemId })}
                                    >
                                        <div className="emote-image">
                                            <img
                                                src={`https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/${emote.itemId}.png`}
                                                alt={emote.name}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="emote-name">{emote.name}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

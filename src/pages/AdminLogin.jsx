import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials. Access denied.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center" style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at center, #1a1a20 0%, #000 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'var(--primary)',
                filter: 'blur(150px)',
                opacity: '0.05',
                borderRadius: '50%',
                zIndex: 0
            }}></div>

            <div className="card" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '2.5rem',
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(24, 24, 27, 0.8)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div className="flex flex-col items-center mb-8">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(251, 191, 36, 0.1)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        border: '1px solid rgba(251, 191, 36, 0.2)'
                    }}>
                        <ShieldCheck size={32} color="var(--primary)" />
                    </div>
                    <h2 style={{ border: 'none', margin: 0, fontSize: '1.75rem' }}>Admin Access</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Secure gateway for administrators</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#fca5a5',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius)',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.875rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In Dashboard'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Protected by Firebase Authentication
                </div>
            </div>
        </div>
    );
}

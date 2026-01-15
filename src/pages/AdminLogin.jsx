import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Failed to login. Check credentials.');
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ height: '100vh' }}>
            <form onSubmit={handleLogin} className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center">Admin Login</h2>
                {error && <p style={{ color: 'var(--accent)', textAlign: 'center' }}>{error}</p>}
                <div className="flex" style={{ flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    );
}

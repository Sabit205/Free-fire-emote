import { useState } from 'react';

export function Card({ children, className = '', ...props }) {
    return (
        <div className={`card ${className}`} {...props}>
            {children}
        </div>
    );
}

export function Button({ children, variant = 'primary', className = '', loading = false, ...props }) {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            {...props}
        >
            {loading && <span className="loader"></span>}
            {children}
        </button>
    );
}

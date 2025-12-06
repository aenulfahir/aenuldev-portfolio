import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            padding: '2rem 0',
            marginTop: 'auto',
            textAlign: 'center'
        }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                    <a href="#" style={{ color: 'var(--text-secondary)' }}><Github size={20} /></a>
                    <a href="#" style={{ color: 'var(--text-secondary)' }}><Linkedin size={20} /></a>
                    <a href="#" style={{ color: 'var(--text-secondary)' }}><Twitter size={20} /></a>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                    &copy; {new Date().getFullYear()} Developer Portfolio. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

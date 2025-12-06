import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, Database, Globe, Server, Smartphone } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { useData } from '../context/DataContext';

const Home: React.FC = () => {
    const { hero } = useData();
    const [text, setText] = useState('');
    const [titleIndex, setTitleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Typewriter effect for multiple titles
    useEffect(() => {
        const currentTitle = hero.titles[titleIndex];
        const typeSpeed = isDeleting ? 50 : 100;

        const timer = setTimeout(() => {
            if (!isDeleting) {
                setText(currentTitle.slice(0, text.length + 1));
                if (text.length === currentTitle.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setText(currentTitle.slice(0, text.length - 1));
                if (text.length === 0) {
                    setIsDeleting(false);
                    setTitleIndex((prev) => (prev + 1) % hero.titles.length);
                }
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, titleIndex, hero.titles]);

    const techStack = [
        { name: 'React', icon: <Code /> },
        { name: 'TypeScript', icon: <Code /> },
        { name: 'Node.js', icon: <Server /> },
        { name: 'PostgreSQL', icon: <Database /> },
        { name: 'Next.js', icon: <Globe /> },
        { name: 'React Native', icon: <Smartphone /> },
    ];

    return (
        <div className="container section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
            {/* Background Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'var(--primary-color)',
                filter: 'blur(150px)',
                opacity: 0.1,
                zIndex: -1
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'var(--secondary-color)',
                filter: 'blur(150px)',
                opacity: 0.1,
                zIndex: -1
            }} />

            <RevealOnScroll>
                <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--primary-color)', background: 'rgba(0, 255, 157, 0.1)', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {hero.greeting}
                </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1.1 }}>
                    I'm <span className="glow-text">{hero.name}</span>
                </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', minHeight: '3.5rem' }}>
                    &lt;{text}<span className="animate-pulse">|</span>/&gt;
                </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.6}>
                <p style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    {hero.description}
                </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.8}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
                    <button className="btn btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                        View Projects <ArrowRight size={18} />
                    </button>
                    <button className="btn btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        Contact Me
                    </button>
                </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1.0}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', opacity: 0.7 }}>
                    {techStack.map((tech) => (
                        <div key={tech.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                {tech.icon}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{tech.name}</span>
                        </div>
                    ))}
                </div>
            </RevealOnScroll>
        </div>
    );
};

export default Home;

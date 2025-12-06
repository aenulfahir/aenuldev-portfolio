import React from 'react';
import { Briefcase, GraduationCap, MapPin, Mail, Phone, Code, Award } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { useData } from '../context/DataContext';

const About: React.FC = () => {
    const { about, hero } = useData();

    return (
        <div className="container section">
            <RevealOnScroll>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="glow-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>About Me</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Getting to know the developer behind the code.
                    </p>
                </div>
            </RevealOnScroll>

            {/* Introduction Card */}
            <RevealOnScroll>
                <div className="glass-panel" style={{
                    padding: '3rem',
                    marginBottom: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        color: '#000',
                        marginBottom: '2rem',
                        boxShadow: '0 0 30px rgba(0, 255, 157, 0.3)'
                    }}>
                        {hero.name.charAt(0)}
                    </div>

                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{hero.name}</h2>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '50px',
                        background: 'rgba(0, 255, 157, 0.1)',
                        color: 'var(--primary-color)',
                        border: '1px solid var(--primary-color)',
                        marginBottom: '2rem',
                        fontWeight: 'bold'
                    }}>
                        {hero.titles[0]}
                    </div>

                    <p style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        margin: '0 auto 2rem'
                    }}>
                        {about.summary}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '2rem',
                        width: '100%'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <MapPin size={18} color="var(--accent-color)" /> {about.contact.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Mail size={18} color="var(--secondary-color)" /> {about.contact.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Phone size={18} color="var(--primary-color)" /> {about.contact.phone}
                        </div>
                    </div>
                </div>
            </RevealOnScroll>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                {/* Left Column: Skills */}
                <div>
                    <RevealOnScroll animation="slide-left">
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Code size={28} color="var(--primary-color)" /> Technical Arsenal
                            </h2>
                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {about.skills.map((skill, index) => (
                                        <span key={index} className="skill-card" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', padding: '0.5rem 1rem' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll animation="slide-left" delay={0.2}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Award size={28} color="var(--accent-color)" /> Certifications
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {about.certifications.map((cert, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-color)' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cert.name}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{cert.issuer} • {cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Right Column: Experience & Education */}
                <div>
                    <RevealOnScroll animation="slide-right">
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Briefcase size={28} color="var(--secondary-color)" /> Professional Journey
                            </h2>
                            <div className="timeline">
                                {about.experience.map((exp, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-dot" />
                                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{exp.role}</h3>
                                        <div style={{ color: 'var(--primary-color)', fontSize: '0.95rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                                            {exp.company} | {exp.period}
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll animation="slide-right" delay={0.2}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <GraduationCap size={28} color="var(--secondary-color)" /> Education
                            </h2>
                            <div className="timeline">
                                {about.education.map((edu, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-dot" />
                                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{edu.degree}</h3>
                                        <div style={{ color: 'var(--primary-color)', fontSize: '0.95rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                                            {edu.school} | {edu.period}
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>{edu.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};

export default About;

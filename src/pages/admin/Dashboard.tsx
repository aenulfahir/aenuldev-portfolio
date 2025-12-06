import React from 'react';
import { useData } from '../../context/DataContext';
import { Briefcase, FileText, DollarSign, Eye, Activity, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { projects, blog, pricing, hero } = useData();

    const stats = [
        { label: 'Total Projects', value: projects.length, icon: <Briefcase size={24} />, color: 'var(--primary-color)', trend: '+2 this month' },
        { label: 'Blog Posts', value: blog.length, icon: <FileText size={24} />, color: 'var(--secondary-color)', trend: 'Updated today' },
        { label: 'Active Plans', value: pricing.length, icon: <DollarSign size={24} />, color: 'var(--accent-color)', trend: 'Stable' },
        { label: 'Profile Views', value: '1,234', icon: <Eye size={24} />, color: '#fff', trend: '+12% vs last week' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Welcome back, <span className="glow-text">{hero.name.split(' ')[0]}</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>System Status: <span style={{ color: 'var(--primary-color)' }}>ONLINE</span> | Secure Connection Established</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            width: '60px',
                            height: '60px',
                            background: stat.color,
                            opacity: 0.1,
                            borderRadius: '50%',
                            filter: 'blur(20px)'
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '12px',
                                background: `rgba(255,255,255,0.05)`,
                                color: stat.color,
                                border: `1px solid ${stat.color}40`
                            }}>
                                {stat.icon}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {stat.trend} <ExternalLink size={12} />
                            </span>
                        </div>

                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, marginBottom: '0.5rem' }}>{stat.value}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Quick Actions / Recent Activity */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} color="var(--primary-color)" /> Recent Activity
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>Project Updated</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modified "County and News App" details</div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>2h ago</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary-color)' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>New Blog Post</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Published "The Future of Web Dev"</div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>5h ago</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>Profile Updated</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Updated skills section</div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1d ago</div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Star size={20} color="var(--accent-color)" /> Quick Actions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link to="/admin/projects" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                            <span>Add New Project</span>
                            <ExternalLink size={16} />
                        </Link>
                        <Link to="/admin/blog" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                            <span>Write Blog Post</span>
                            <ExternalLink size={16} />
                        </Link>
                        <Link to="/admin/profile" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                            <span>Update Profile</span>
                            <ExternalLink size={16} />
                        </Link>
                        <Link to="/" target="_blank" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                            View Live Site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

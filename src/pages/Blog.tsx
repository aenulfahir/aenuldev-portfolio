import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Search, Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';
import { useData } from '../context/DataContext';

const Blog: React.FC = () => {
    const { blog } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Get unique categories
    const categories = Array.from(new Set(blog.map(post => post.category)));

    // Filter posts
    const filteredPosts = blog.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const featuredPost = blog[0]; // Assume first post is featured
    const remainingPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

    return (
        <div className="container section" id="blog" style={{ paddingTop: '6rem' }}>
            <RevealOnScroll>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="glow-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Latest Insights</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Exploring the frontiers of technology, design, and innovation.
                    </p>
                </div>
            </RevealOnScroll>

            {/* Search and Filter */}
            <RevealOnScroll delay={0.1}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '50px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                backdropFilter: 'blur(10px)'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '20px',
                                border: '1px solid',
                                borderColor: selectedCategory === null ? 'var(--primary-color)' : 'var(--border-color)',
                                background: selectedCategory === null ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
                                color: selectedCategory === null ? 'var(--primary-color)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: selectedCategory === cat ? 'var(--primary-color)' : 'var(--border-color)',
                                    background: selectedCategory === cat ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
                                    color: selectedCategory === cat ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </RevealOnScroll>

            {/* Featured Post */}
            {!searchTerm && !selectedCategory && featuredPost && (
                <RevealOnScroll delay={0.2}>
                    <div className="glass-panel" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '3rem',
                        padding: '3rem',
                        marginBottom: '4rem',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Background Element */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-20%',
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(0, 255, 157, 0.1) 0%, transparent 70%)',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <span style={{
                                display: 'inline-block',
                                fontSize: '0.9rem',
                                color: 'var(--accent-color)',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                letterSpacing: '1px'
                            }}>
                                FEATURED ARTICLE
                            </span>
                            <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>{featuredPost.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                                {featuredPost.excerpt}
                            </p>
                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> {featuredPost.author}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {featuredPost.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={16} /> {featuredPost.category}</span>
                            </div>
                            <Link to={`/blog/${featuredPost.id}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 2rem' }}>
                                Read Article <ArrowRight size={20} />
                            </Link>
                        </div>

                        {/* Placeholder for Featured Image - using a gradient/pattern for now */}
                        <div style={{
                            height: '100%',
                            minHeight: '300px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <div>Read in 5 min</div>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>
            )}

            {/* Post Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {(searchTerm || selectedCategory ? filteredPosts : remainingPosts).map((post, index) => (
                    <RevealOnScroll key={post.id} delay={index * 0.1}>
                        <div className="glass-panel hover-card" style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            overflow: 'hidden'
                        }}>
                            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--primary-color)',
                                        background: 'rgba(0, 255, 157, 0.1)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontWeight: 'bold'
                                    }}>
                                        {post.category}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{post.date}</span>
                                </div>

                                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: 1.3 }}>{post.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {post.excerpt}
                                </p>

                                <div style={{
                                    marginTop: 'auto',
                                    paddingTop: '1.5rem',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <User size={14} /> {post.author}
                                    </span>
                                    <Link to={`/blog/${post.id}`} style={{
                                        color: 'var(--primary-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        transition: 'gap 0.2s ease'
                                    }}
                                        className="read-more-link"
                                    >
                                        Read More <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <Search size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No articles found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Blog;

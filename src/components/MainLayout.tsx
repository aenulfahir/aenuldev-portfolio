import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import Projects from '../pages/Projects';
import Pricing from '../pages/Pricing';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';

const MainLayout: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <section id="home">
                    <Home />
                </section>
                <section id="about" style={{ background: 'var(--surface-color)' }}>
                    <About />
                </section>
                <section id="projects">
                    <Projects />
                </section>
                <section id="pricing" style={{ background: 'var(--surface-color)' }}>
                    <Pricing />
                </section>
                <section id="blog">
                    <Blog />
                </section>
                <section id="contact" style={{ background: 'var(--surface-color)' }}>
                    <Contact />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'slide-left' | 'slide-right';
    delay?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, animation = 'fade-up', delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const getAnimationClass = () => {
        switch (animation) {
            case 'slide-left': return 'animate-slide-left';
            case 'slide-right': return 'animate-slide-right';
            default: return 'animate-fade-up';
        }
    };

    return (
        <div
            ref={ref}
            className={isVisible ? getAnimationClass() : ''}
            style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease', animationDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

export default RevealOnScroll;

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const NotFound = (): JSX.Element => {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.error-content', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="error-content min-h-screen pt-20 text-center">
            <div className="section-container">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="mb-8">The page you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors duration-300"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;

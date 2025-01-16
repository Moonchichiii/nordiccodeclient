import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import React from 'react';

const LoadingScreen: React.FC = () => {
    const loaderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main loading animation
            gsap.fromTo(
                progressRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.5,
                    ease: 'power2.inOut',
                }
            );

            // Dot animations
            const dots = textRef.current?.querySelectorAll<HTMLSpanElement>('.dot');
            if (dots) {
                gsap.to(dots, {
                    y: -10,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    stagger: {
                        each: 0.2,
                        repeat: -1,
                        yoyo: true,
                    },
                });
            }

            // Background blur effect
            gsap.fromTo(
                loaderRef.current,
                { backdropFilter: 'blur(0px)' },
                {
                    backdropFilter: 'blur(8px)',
                    duration: 0.5,
                    ease: 'power2.out',
                }
            );
        }, loaderRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-md"
        >
            <div className="relative w-full max-w-sm mx-4">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold gradient-text">Nordic Code Works</h2>
                </div>

                <div className="relative">
                    <div className="h-0.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            ref={progressRef}
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-200 origin-left"
                            style={{ transform: 'scaleX(0)' }}
                        />
                    </div>

                    <div ref={textRef} className="absolute top-4 left-0 right-0 text-center">
                        <div className="inline-flex items-center text-sm text-gray-400">
                            Loading
                            <span className="inline-flex ml-1">
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 -z-10">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-yellow-400/10 blur-2xl animate-pulse"
                            style={{
                                width: `${150 + i * 30}px`,
                                height: `${150 + i * 30}px`,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                animationDelay: `${i * 0.2}s`,
                                opacity: 0.1 - i * 0.02,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(LoadingScreen);

import { useEffect } from 'react';
import { gsap } from 'gsap';

interface Project {
    id: number;
    title: string;
    description: string;
    link: string;
}

const projects: Project[] = [
    {
        id: 1,
        title: 'Project One',
        description: 'A brief description of Project One.',
        link: 'https://github.com/username/project-one',
    },
    {
        id: 2,
        title: 'Project Two',
        description: 'A brief description of Project Two.',
        link: 'https://github.com/username/project-two',
    },
    // Add more projects as needed
];

const Portfolio: React.FC = () => {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.portfolio-content', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="portfolio-content min-h-screen pt-20">
            <div className="section-container">
                <h1 className="text-4xl font-bold mb-8">Our Portfolio</h1>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <li
                            key={project.id}
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                View Project
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Portfolio;

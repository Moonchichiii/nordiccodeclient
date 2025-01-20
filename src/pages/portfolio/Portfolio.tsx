import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  location: string;
  services: string;
  year: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    location: "Stockholm",
    services: "Full Stack Development",
    year: "2024",
    link: "/projects/ecommerce"
  },
  {
    id: 2,
    title: "Analytics Dashboard",
    location: "Oslo",
    services: "Frontend Development",
    year: "2023",
    link: "/projects/analytics"
  }
];

const Portfolio: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-content', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    return () => ctx.revert();
  }, []);

  const categories = [
    { id: undefined, label: 'All' },
    { id: 'Dev', label: 'Development' },
    { id: 'Design', label: 'Design' }
  ];

  return (
    <main className="min-h-screen bg-gray-900 text-white py-20 px-4">
      <div className="portfolio-content max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-light mb-8">
            <span className="block">Our Latest</span>
            <span className="block gradient-text">Projects</span>
          </h1>
          
          <div className="flex gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-yellow-500 text-gray-900'
                    : 'border border-gray-800 hover:border-yellow-500/30'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </header>

        {/* Projects Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-12 text-sm text-gray-400 px-4 mb-4">
            <div className="col-span-3">Project</div>
            <div className="hidden md:block col-span-3">Location</div>
            <div className="hidden md:block col-span-4">Services</div>
            <div className="hidden md:block col-span-2">Year</div>
          </div>

          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(project.link)}
                className="grid grid-cols-12 items-center p-4 rounded-lg hover:bg-gray-800/50 
                  cursor-pointer group transition-all"
              >
                <div className="col-span-12 md:col-span-3">
                  <h3 className="text-xl font-light group-hover:text-yellow-500 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <div className="hidden md:block col-span-3 text-gray-400">
                  {project.location}
                </div>
                <div className="hidden md:block col-span-4 text-gray-400">
                  {project.services}
                </div>
                <div className="hidden md:block col-span-1 text-gray-400">
                  {project.year}
                </div>
                <div className="col-span-1 flex justify-end">
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 
                    group-hover:translate-x-1 transition-all text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-20">
          <button 
            onClick={() => navigate('/contact')}
            className="group px-8 py-3 bg-yellow-500 text-gray-900 rounded-lg 
              hover:bg-yellow-400 transition-all duration-300 inline-flex items-center gap-2"
          >
            Start a Project
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;
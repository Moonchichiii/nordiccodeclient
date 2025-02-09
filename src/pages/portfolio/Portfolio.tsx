import { FC, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';

interface Project {
  readonly id: number;
  readonly title: string;
  readonly location: string;
  readonly services: string;
  readonly year: string;
  readonly link: string;
}

const projects: readonly Project[] = [
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

const categories = [
  { id: undefined, label: 'All' },
  { id: 'Dev', label: 'Development' },
  { id: 'Design', label: 'Design' }
];

const Portfolio: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }).from(headerRef.current?.querySelectorAll('button'), {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
      }, '-=0.4');

      gsap.from(projectsRef.current?.children, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        }
      });

      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header ref={headerRef} className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-light mb-8">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              Our Latest
            </span>
            <span className="block">Projects</span>
          </h1>
          
          <div className="flex gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => setSelectedCategory(category.id)}
                className={`group px-6 py-2 rounded-[2rem] hover:rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'border border-primary/20 hover:border-primary text-foreground-alt hover:text-primary'
                }`}
              >
                <span className="flex items-center gap-2">
                  {category.label}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </span>
              </button>
            ))}
          </div>
        </header>

        <section className="space-y-6 mb-20">
          <div className="grid grid-cols-12 text-sm text-foreground-alt px-4 mb-4">
            <div className="col-span-3">Project</div>
            <div className="hidden md:block col-span-3">Location</div>
            <div className="hidden md:block col-span-4">Services</div>
            <div className="hidden md:block col-span-2">Year</div>
          </div>

          <div ref={projectsRef} className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(project.link)}
                className="group grid grid-cols-12 items-center p-6 rounded-2xl border border-primary/10 
                  hover:border-primary/20 cursor-pointer transition-all duration-300 bg-background"
              >
                <div className="col-span-12 md:col-span-3">
                  <h3 className="text-xl font-light text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {project.title}
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 
                      group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                </div>
                <div className="hidden md:block col-span-3 text-foreground-alt">
                  {project.location}
                </div>
                <div className="hidden md:block col-span-4 text-foreground-alt">
                  {project.services}
                </div>
                <div className="hidden md:block col-span-2 text-foreground-alt">
                  {project.year}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div ref={ctaRef} className="text-center">
          <button 
            onClick={() => navigate('/contact')}
            className="group relative px-8 py-4 text-base font-medium overflow-hidden
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
              focus-visible:ring-offset-2 rounded-[2rem] hover:rounded-xl transition-all
              bg-primary text-white hover:bg-primary-light inline-flex items-center gap-2"
          >
            <span>Start a Project</span>
            <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;

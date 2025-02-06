import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Header animations
      tl.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      });

      // Form animations
      tl.from(formRef.current?.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
      }, '-=0.4');
    });

    return () => mm.revert();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log(data);
  };

  return (
    <main className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div ref={titleRef} className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-light mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              Let's discuss
            </span>
            <span className="block">your project</span>
          </h1>
          <p className="text-xl text-foreground-alt max-w-2xl">
            Share your vision with us and let's create something extraordinary together.
          </p>
        </div>

        {/* Form Section */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-8"
        >
          <div className="group relative">
            <label className="text-sm font-medium text-foreground-alt group-focus-within:text-primary transition-colors">
              Name
            </label>
            <input
              {...register('name')}
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-primary/20 
                py-3 px-0 text-foreground text-xl focus:ring-0 focus:border-primary 
                transition-colors placeholder:text-foreground-alt/50"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="group relative">
            <label className="text-sm font-medium text-foreground-alt group-focus-within:text-primary transition-colors">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-primary/20 
                py-3 px-0 text-foreground text-xl focus:ring-0 focus:border-primary 
                transition-colors placeholder:text-foreground-alt/50"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="group relative">
            <label className="text-sm font-medium text-foreground-alt group-focus-within:text-primary transition-colors">
              Subject
            </label>
            <input
              {...register('subject')}
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-primary/20 
                py-3 px-0 text-foreground text-xl focus:ring-0 focus:border-primary 
                transition-colors placeholder:text-foreground-alt/50"
              placeholder="Project subject"
            />
            {errors.subject && (
              <p className="mt-2 text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="group relative">
            <label className="text-sm font-medium text-foreground-alt group-focus-within:text-primary transition-colors">
              Message
            </label>
            <textarea
              {...register('message')}
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-primary/20 
                py-3 px-0 text-foreground text-xl focus:ring-0 focus:border-primary 
                transition-colors resize-none placeholder:text-foreground-alt/50"
              rows={4}
              placeholder="Tell us about your project"
            />
            {errors.message && (
              <p className="mt-2 text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-8 py-4 text-base font-medium overflow-hidden
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                focus-visible:ring-offset-2 rounded-[2rem] hover:rounded-xl transition-all
                bg-primary text-white hover:bg-primary-light inline-flex items-center gap-2"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Contact;
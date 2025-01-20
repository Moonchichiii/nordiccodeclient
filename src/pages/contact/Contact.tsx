import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-content', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
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
      <div className="contact-content relative">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-light mb-6 text-white">
            <span className="block">Let's discuss</span>
            <span className="block">your project</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Share your vision with us and let's create something extraordinary together.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
          <div className="group relative">
            <label className="text-sm font-medium text-gray-400 group-focus-within:text-yellow-500">
              Name
            </label>
            <input
              {...register('name')}
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-800 
                py-3 px-0 text-white text-xl focus:ring-0 focus:border-yellow-500 
                transition-colors"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="group relative">
            <label className="text-sm font-medium text-gray-400 group-focus-within:text-yellow-500">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-800 
                py-3 px-0 text-white text-xl focus:ring-0 focus:border-yellow-500 
                transition-colors"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="group relative">
            <label className="text-sm font-medium text-gray-400 group-focus-within:text-yellow-500">
              Subject
            </label>
            <input
              {...register('subject')}
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-800 
                py-3 px-0 text-white text-xl focus:ring-0 focus:border-yellow-500 
                transition-colors"
              placeholder="Project subject"
            />
            {errors.subject && (
              <p className="mt-2 text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="group relative">
            <label className="text-sm font-medium text-gray-400 group-focus-within:text-yellow-500">
              Message
            </label>
            <textarea
              {...register('message')}
              className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-800 
                py-3 px-0 text-white text-xl focus:ring-0 focus:border-yellow-500 
                transition-colors resize-none"
              rows={4}
              placeholder="Tell us about your project"
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center gap-2 px-8 py-3 bg-yellow-500 text-gray-900 
              rounded-lg hover:bg-yellow-400 transition-all duration-300 text-sm font-medium"
          >
            <span>Send Message</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
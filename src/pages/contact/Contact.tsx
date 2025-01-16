import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
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
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit: SubmitHandler<ContactFormData> = (data) => {
        console.log(data);
    };

    return (
        <div className="contact-content min-h-screen pt-20">
            <div className="section-container">
                <h1>Contact Us</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input {...register('name')} className="input" />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input {...register('email')} className="input" />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Subject</label>
                        <input {...register('subject')} className="input" />
                        {errors.subject && <p className="text-red-500">{errors.subject.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Message</label>
                        <textarea {...register('message')} className="textarea" />
                        {errors.message && <p className="text-red-500">{errors.message.message}</p>}
                    </div>
                    <button type="submit" className="btn">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;

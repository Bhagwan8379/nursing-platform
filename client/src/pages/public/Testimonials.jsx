import { Star, Quote } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useGetPublicTestimonialsQuery } from '@/redux/apis/bookingApi'

const Testimonials = () => {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    const { data: testimonialsData } = useGetPublicTestimonialsQuery()

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.15 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    const defaultTestimonials = [
        {
            name: 'Rahul Patil',
            location: 'Aurangabad',
            rating: 5,
            comment: 'Excellent service! The nurse was very professional and caring. My father recovered quickly with her help.'
        },
        {
            name: 'Sunita More',
            location: 'Pune',
            rating: 5,
            comment: 'Very easy to book. The nurse arrived on time and was very knowledgeable. Highly recommended!'
        },
        {
            name: 'Amit Sharma',
            location: 'Nashik',
            rating: 4,
            comment: 'Great platform for home nursing. The booking process is simple and the nurses are qualified.'
        },
    ]

    const testimonials = testimonialsData?.result && testimonialsData.result.length > 0
        ? testimonialsData.result.map(t => ({
            name: t.name,
            location: 'Verified Patient',
            rating: t.rating,
            comment: t.comment
        }))
        : defaultTestimonials

    const avatarGradients = [
        'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
        'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    ]

    return (
        <section
            ref={sectionRef}
            className="py-24 px-4 relative overflow-hidden bg-white"
        >
            {/* Background accent */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] opacity-[0.03] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur(60px)' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div
                    className={`text-center mb-14 transition-all duration-700 ease-out transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                >
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full inline-block mb-4">
                        Patient Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight font-heading">
                        What Patients Say
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
                        Real experiences from real patients across India
                    </p>
                </div>

                {/* Testimonials Infinite Marquee */}
                <div className="relative w-full overflow-hidden py-4">
                    {/* Inline Style for keyframe marquee animation */}
                    <style>{`
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .marquee-container {
                            display: flex;
                            width: max-content;
                            animation: marquee 25s linear infinite;
                        }
                        .marquee-container:hover {
                            animation-play-state: paused;
                        }
                    `}</style>

                    <div
                        className={`marquee-container gap-6 transition-all duration-1000 ease-out transform ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        {[...testimonials, ...testimonials].map((t, index) => (
                            <div
                                key={index}
                                style={{
                                    borderRadius: '1.25rem',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                }}
                                className="w-[290px] sm:w-[350px] md:w-[380px] flex-shrink-0 flex flex-col justify-between p-7 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-[0_16px_40px_-8px_rgba(147,51,234,0.1)] transition-all duration-500 hover:-translate-y-1.5 group"
                            >
                                <div>
                                    {/* Rating Row & Quote Icon */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-[14px] h-[14px] transition-all duration-300 ${
                                                        i < t.rating
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'fill-gray-100 text-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)' }}
                                        >
                                            <Quote className="w-4 h-4 text-purple-400" style={{ strokeWidth: 1.5 }} />
                                        </div>
                                    </div>

                                    {/* Comment text */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        "{t.comment}"
                                    </p>
                                </div>

                                {/* Author info */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                                        style={{ background: avatarGradients[index % testimonials.length] }}
                                    >
                                        <span className="text-white font-bold text-xs">{t.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm leading-tight">{t.name}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">{t.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Testimonials
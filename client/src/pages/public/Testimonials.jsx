import { Star, Quote } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const Testimonials = () => {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.15 } // Trigger when 15% of the section is visible
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

    const testimonials = [
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

    return (
        <section 
            ref={sectionRef} 
            className="py-20 px-4 relative overflow-hidden bg-white"
        >
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header Section */}
                <div 
                    className={`text-center mb-16 transition-all duration-700 ease-out transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                >
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest bg-purple-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                        Patient Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        What Patients Say
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto text-base">
                        Real experiences from real patients
                    </p>
                </div>

                {/* Testimonials Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <div 
                            key={t.name}
                            style={{ 
                                transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
                                borderRadius: '1.25rem'
                            }}
                            className={`flex flex-col justify-between p-8 bg-white border border-purple-100/50 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(168,85,247,0.1)] hover:border-purple-200/80 transition-all duration-500 hover:-translate-y-1.5 group transform ${
                                isVisible 
                                    ? 'opacity-100 translate-y-0 duration-700 ease-out' 
                                    : 'opacity-0 translate-y-12'
                            }`}
                        >
                            <div>
                                {/* Quotes icon decoration & Rating */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                                                    i < t.rating 
                                                        ? 'fill-amber-400 text-amber-400' 
                                                        : 'fill-gray-100 text-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <Quote className="w-8 h-8 text-purple-100 group-hover:text-purple-200 transition-colors" style={{ strokeWidth: 1.2 }} />
                                </div>

                                {/* Comment text */}
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                                    "{t.comment}"
                                </p>
                            </div>

                            {/* Author info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-sm">
                                        {t.name[0]}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                    <p className="text-xs text-gray-400 font-medium">{t.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Testimonials
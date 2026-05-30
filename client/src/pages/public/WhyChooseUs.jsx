import { Clock, Phone, Shield, Star } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const WhyChooseUs = () => {
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

    const features = [
        { 
            icon: <Shield className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />, 
            title: 'Verified Nurses', 
            desc: 'All nurses are verified with document checks and qualification validation.' 
        },
        { 
            icon: <Clock className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />, 
            title: '24/7 Available', 
            desc: 'Book nursing services any time of the day or night.' 
        },
        { 
            icon: <Star className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />, 
            title: 'Rated & Reviewed', 
            desc: 'Choose nurses based on real patient reviews and ratings.' 
        },
        { 
            icon: <Phone className="w-5.5 h-5.5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />, 
            title: 'Real-time Updates', 
            desc: 'Track your nurse in real-time and get notified at every step.' 
        },
    ]

    return (
        <section 
            ref={sectionRef} 
            className="py-20 px-4 relative overflow-hidden bg-slate-50"
        >

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header Section */}
                <div 
                    className={`text-center mb-16 transition-all duration-700 ease-out transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                >
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest bg-purple-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                        Our Strengths
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        Why Choose CareNest?
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto text-base">
                        We ensure the highest quality of home nursing care
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={feature.title}
                            style={{ 
                                transitionDelay: isVisible ? `${index * 120}ms` : '0ms',
                                borderRadius: '1.25rem'
                            }}
                            className={`p-7 bg-white border border-purple-100/50 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(168,85,247,0.1)] hover:border-purple-200/80 transition-all duration-500 hover:-translate-y-1.5 group transform ${
                                isVisible 
                                    ? 'opacity-100 translate-y-0 duration-700 ease-out' 
                                    : 'opacity-0 translate-y-12'
                            }`}
                        >
                            {/* Icon container */}
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-purple-100/70 shadow-inner">
                                {feature.icon}
                            </div>
                            
                            <h3 className="font-bold text-gray-900 mb-2.5 tracking-tight group-hover:text-purple-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default WhyChooseUs
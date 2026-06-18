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

    const features = [
        {
            icon: <Shield className="w-5 h-5 text-purple-600" />,
            title: 'Verified Nurses',
            desc: 'All nurses are verified with document checks and qualification validation.'
        },
        {
            icon: <Clock className="w-5 h-5 text-purple-600" />,
            title: '24/7 Available',
            desc: 'Book nursing services any time of the day or night.'
        },
        {
            icon: <Star className="w-5 h-5 text-purple-600" />,
            title: 'Rated & Reviewed',
            desc: 'Choose nurses based on real patient reviews and ratings.'
        },
        {
            icon: <Phone className="w-5 h-5 text-purple-600" />,
            title: 'Real-time Updates',
            desc: 'Track your nurse in real-time and get notified at every step.'
        },
    ]

    return (
        <section
            ref={sectionRef}
            className="py-24 px-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f3ff 50%, #fafafa 100%)' }}
        >
            {/* Subtle decorative element */}
            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur(80px)' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div
                    className={`text-center mb-14 transition-all duration-700 ease-out transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                >
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full inline-block mb-4">
                        Our Strengths
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight font-heading">
                        Why Choose CareNest?
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
                        We ensure the highest quality of home nursing care
                    </p>
                </div>

                {/* Features Grid */}
                <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible gap-5 pb-6 lg:pb-0 snap-x snap-mandatory scrollbar-none">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            style={{
                                transitionDelay: isVisible ? `${index * 120}ms` : '0ms',
                                borderRadius: '1.125rem',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            }}
                            className={`w-[260px] sm:w-[320px] lg:w-auto flex-shrink-0 snap-start p-7 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.12)] transition-all duration-500 hover:-translate-y-1.5 group transform ${
                                isVisible
                                    ? 'opacity-100 translate-y-0 duration-700 ease-out'
                                    : 'opacity-0 translate-y-12'
                            }`}
                        >
                            {/* Icon container */}
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                                style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)', boxShadow: '0 2px 8px rgba(147,51,234,0.08)' }}
                            >
                                {feature.icon}
                            </div>

                            <h3 className="font-bold text-gray-900 mb-2 text-sm tracking-tight group-hover:text-purple-700 transition-colors font-heading">
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
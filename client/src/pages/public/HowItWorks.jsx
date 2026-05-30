import { CalendarCheck, Heart, UserCheck } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const HowItWorks = () => {
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

    const steps = [
        {
            icon: <CalendarCheck className="w-7 h-7 text-purple-600 group-hover:text-purple-700 transition-colors" />,
            title: 'Book a Service',
            desc: 'Select the nursing service you need, add patient details and preferred time.'
        },
        {
            icon: <UserCheck className="w-7 h-7 text-purple-600 group-hover:text-purple-700 transition-colors" />,
            title: 'Nurse Assigned',
            desc: 'Our admin assigns a verified, qualified nurse matching your requirements.'
        },
        {
            icon: <Heart className="w-7 h-7 text-purple-600 group-hover:text-purple-700 transition-colors" />,
            title: 'Care at Home',
            desc: 'Nurse arrives at your home and provides professional nursing care.'
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
                        Simple Process
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto text-base">
                        Getting professional nursing care at home is simple and easy
                    </p>
                </div>

                {/* Steps Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div 
                            key={step.title} 
                            style={{ 
                                transitionDelay: isVisible ? `${index * 180}ms` : '0ms',
                                borderRadius: '1.25rem'
                            }}
                            className={`flex flex-col items-center text-center p-8 bg-white border border-purple-100/50 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(168,85,247,0.1)] hover:border-purple-200/80 transition-all duration-500 hover:-translate-y-1.5 group transform ${
                                isVisible 
                                    ? 'opacity-100 translate-y-0 duration-700 ease-out' 
                                    : 'opacity-0 translate-y-12'
                            }`}
                        >
                            <div className="relative mb-6">
                                {/* Rotating outer gradient border ring on hover */}
                                <div className="absolute inset-0 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 blur-xs" />
                                
                                {/* Icon Container */}
                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:bg-purple-100/70">
                                    {step.icon}
                                </div>
                                
                                {/* Number Badge */}
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-md z-20 border border-white">
                                    <span className="text-white text-xs font-bold">{index + 1}</span>
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-gray-900 text-lg mb-3 tracking-tight group-hover:text-purple-600 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
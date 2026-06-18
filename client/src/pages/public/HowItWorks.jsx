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

    const steps = [
        {
            icon: <CalendarCheck className="w-6 h-6 text-purple-600" />,
            title: 'Book a Service',
            desc: 'Select the nursing service you need, add patient details and preferred time.'
        },
        {
            icon: <UserCheck className="w-6 h-6 text-purple-600" />,
            title: 'Nurse Assigned',
            desc: 'Our admin assigns a verified, qualified nurse matching your requirements.'
        },
        {
            icon: <Heart className="w-6 h-6 text-purple-600" />,
            title: 'Care at Home',
            desc: 'Nurse arrives at your home and provides professional nursing care.'
        },
    ]

    return (
        <section
            ref={sectionRef}
            className="py-24 px-4 relative overflow-hidden bg-white"
        >
            {/* Subtle background accent */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.035] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur(60px)' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header Section */}
                <div
                    className={`text-center mb-16 transition-all duration-700 ease-out transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                >
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full inline-block mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight font-heading">
                        How It Works
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
                        Getting professional nursing care at home is simple and easy
                    </p>
                </div>

                {/* Steps Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

                    {/* Connector line (desktop only) */}
                    <div
                        className="hidden md:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.2) 20%, rgba(147,51,234,0.2) 80%, transparent)' }}
                    />

                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            style={{
                                transitionDelay: isVisible ? `${index * 180}ms` : '0ms',
                                borderRadius: '1.25rem',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            }}
                            className={`flex flex-col items-center text-center p-8 bg-white border border-gray-100 hover:border-purple-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_40px_-8px_rgba(147,51,234,0.12)] group transform ${
                                isVisible
                                    ? 'opacity-100 translate-y-0 duration-700 ease-out'
                                    : 'opacity-0 translate-y-12'
                            }`}
                        >
                            <div className="relative mb-6">
                                {/* Icon Container */}
                                <div
                                    className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center relative z-10 transition-all duration-400 group-hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)', boxShadow: '0 4px 12px rgba(147,51,234,0.1)' }}
                                >
                                    {step.icon}
                                </div>

                                {/* Number Badge */}
                                <div
                                    className="absolute -top-2 -right-2 w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-md z-20 border-2 border-white"
                                    style={{ background: 'linear-gradient(135deg, #9333ea, #7c3aed)' }}
                                >
                                    <span className="text-white text-[10px] font-black">{index + 1}</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-900 text-base mb-2.5 tracking-tight group-hover:text-purple-700 transition-colors font-heading">
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
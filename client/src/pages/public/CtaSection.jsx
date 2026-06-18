import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ctaHeroImage from '@/assets/nursing_cta_hero.png'

const CtaSection = () => {
    const navigate = useNavigate()
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

    const trustPoints = [
        'Verified & background-checked nurses',
        'Book in under 2 minutes',
        'Available 24/7, 365 days a year',
    ]

    return (
        <section
            ref={sectionRef}
            className="py-24 px-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f3ff 50%, #fafafa 100%)' }}
        >
            {/* Background decoration */}
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.04] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur(80px)' }}
            />

            <div className="max-w-6xl mx-auto relative z-10">
                <div
                    style={{
                        borderRadius: '1.75rem',
                        boxShadow: '0 8px 40px -8px rgba(147, 51, 234, 0.1), 0 2px 12px rgba(0,0,0,0.04)',
                    }}
                    className={`overflow-hidden bg-white border border-gray-100 transition-all duration-1000 ease-out transform ${
                        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
                    }`}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12">

                        {/* Left Content Side */}
                        <div className="lg:col-span-7 p-10 md:p-14">
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full inline-block mb-6">
                                Immediate Nursing Support
                            </span>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-5 tracking-tight font-heading">
                                Need a Professional{' '}
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    Nurse at Your Home?
                                </span>
                            </h2>

                            <p className="text-gray-500 text-base md:text-[17px] mb-8 leading-relaxed max-w-lg">
                                Book a verified, highly-qualified nurse in minutes. Receive compassionate, premium healthcare in the comfort and safety of your own home.
                            </p>

                            {/* Trust points */}
                            <div className="flex flex-col gap-2.5 mb-9">
                                {trustPoints.map((point) => (
                                    <div key={point} className="flex items-center gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-sm text-gray-600 font-medium">{point}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/customer/register')}
                                    className="text-white font-bold px-8 rounded-xl border-none transition-all duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                                        boxShadow: '0 4px 16px rgba(147, 51, 234, 0.35)',
                                    }}
                                >
                                    Book Now
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate('/nurse/register')}
                                    className="rounded-xl border-purple-200 text-purple-700 bg-purple-50/60 hover:bg-purple-100/60 hover:border-purple-300 font-semibold px-8 transition-all duration-300"
                                >
                                    Join as Nurse
                                </Button>
                            </div>
                        </div>

                        {/* Right Image Side */}
                        <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-0">
                            <img
                                src={ctaHeroImage}
                                alt="Caring professional nurse smiling"
                                className="w-full h-full object-cover"
                                style={{ minHeight: '280px' }}
                            />
                            {/* Gradient overlay on left edge for blend */}
                            <div
                                className="absolute inset-y-0 left-0 w-20 hidden lg:block"
                                style={{ background: 'linear-gradient(to right, white, transparent)' }}
                            />
                            {/* Bottom overlay */}
                            <div
                                className="absolute inset-x-0 bottom-0 h-20 lg:hidden"
                                style={{ background: 'linear-gradient(to top, white, transparent)' }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default CtaSection
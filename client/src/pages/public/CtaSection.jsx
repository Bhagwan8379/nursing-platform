import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
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

    return (
        <section 
            ref={sectionRef}
            className="py-24 px-4 bg-slate-50 relative overflow-hidden"
        >

            <div className="max-w-6xl mx-auto relative z-10">
                <div 
                    style={{ borderRadius: '1.75rem' }}
                    className={`bg-white border border-purple-100/60 p-8 md:p-14 shadow-[0_10px_40px_-12px_rgba(168,85,247,0.08)] transition-all duration-1000 ease-out transform ${
                        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'
                    }`}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Left Content Side */}
                        <div className="lg:col-span-7 text-center lg:text-left">
                            <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest bg-purple-50 px-3.5 py-1.5 rounded-full inline-block mb-4">
                                Immediate Nursing Support
                            </span>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-4.5xl font-black text-gray-900 leading-tight mb-5 tracking-tight">
                                Need a Professional <br />
                                <span className="text-purple-600">
                                    Nurse at Your Home?
                                </span>
                            </h2>
                            
                            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Book a verified, highly-qualified nurse in minutes. Receive compassionate, premium healthcare in the comfort and safety of your own home.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/customer/register')}
                                    style={{ borderRadius: '0.75rem' }}
                                    className="text-white font-bold px-8 shadow-md hover:shadow-lg transition-all duration-300 bg-purple-600 hover:bg-purple-700 border-none"
                                >
                                    Book Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate('/nurse/register')}
                                    style={{ borderRadius: '0.75rem' }}
                                    className="border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50 hover:border-purple-300 font-semibold px-8 transition-all duration-300"
                                >
                                    Join as Nurse
                                </Button>
                            </div>
                        </div>

                        {/* Right Image Side */}
                        <div className="lg:col-span-5 flex justify-center relative">
                            {/* Accent backdrop ring */}
                            <div className="absolute inset-0 bg-purple-50 rounded-3xl blur-md -z-10 transition-transform duration-500" />
                            
                            <div 
                                style={{ borderRadius: '1.5rem' }}
                                className="relative overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] w-full max-w-[420px] transition-transform duration-500 hover:scale-[1.02]"
                            >
                                <img 
                                    src={ctaHeroImage} 
                                    alt="Caring professional nurse smiling" 
                                    className="w-full h-full object-cover"
                                />
                                {/* Soft overlay highlight */}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/15 to-transparent" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default CtaSection
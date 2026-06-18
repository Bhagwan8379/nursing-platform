import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Phone, Calendar, UserCheck, Stethoscope } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
    const data = [
        { value: '500+', label: 'Patients Served' },
        { value: '50+', label: 'Verified Nurses' },
        { value: '4.8★', label: 'Average Rating' },
    ]
    return (
        <section className="relative min-h-screen md:h-screen flex items-center px-4 overflow-hidden -mt-16 bg-slate-950 py-20 md:py-0">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center"
                style={{ zIndex: 0 }}
            >
                <source src={import.meta.env.VITE_HERO_VIDEO_URL} type="video/mp4" />
            </video>

            {/* Premium Multi-layer Overlay */}
            <div
                className="absolute inset-0 hero-overlay"
                style={{ zIndex: 1 }}
            />

            {/* Subtle purple vignette at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-40"
                style={{
                    zIndex: 1,
                    background: 'linear-gradient(to top, rgba(10,5,30,0.6) 0%, transparent 100%)',
                }}
            />

            <div className="w-full max-w-7xl mx-auto relative pt-24 pb-16 md:pt-16 md:pb-12" style={{ zIndex: 2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

                    <div>
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-semibold text-white/80 tracking-wide">Trusted Home Nursing Platform</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.15] md:leading-[1.1] mb-5 tracking-tight font-heading">
                            Professional Nursing<br className="hidden sm:inline" /> Care{' '}
                            <span
                                className="font-black"
                                style={{
                                    background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                At Your Home
                            </span>
                        </h1>

                        <p className="text-white/65 text-sm sm:text-base md:text-[17px] mb-9 leading-relaxed max-w-md">
                            Connect with verified, qualified nurses for at-home medical care.
                            From post-surgery care to elder care — we have you covered.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                size="lg"
                                onClick={() => navigate('/customer/register')}
                                className="w-full sm:w-auto text-white font-semibold shadow-lg transition-all duration-300 rounded-xl border-none px-7 flex justify-center items-center"
                                style={{
                                    background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                                    boxShadow: '0 4px 20px rgba(147, 51, 234, 0.45)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(192, 38, 211, 0.6)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(147, 51, 234, 0.45)'}
                            >
                                Book a Nurse
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/services')}
                                className="w-full sm:w-auto rounded-xl px-7 font-semibold transition-all duration-300 flex justify-center items-center"
                                style={{
                                    border: '1.5px solid rgba(255,255,255,0.2)',
                                    color: 'rgba(255,255,255,0.85)',
                                    background: 'rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                View Services
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3 sm:gap-8 mt-10 pt-8 border-t border-white/10">
                            {data.map((stat, i) => (
                                <div key={stat.label} className={i > 0 ? 'pl-3 sm:pl-8 border-l border-white/10' : ''}>
                                    <p
                                        className="text-xl sm:text-2xl font-black leading-none mb-1 font-heading"
                                        style={{
                                            background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        {stat.value}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-white/50 font-medium tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right Side: Orbit Ring ── */}
                    <div className="hidden md:flex items-center justify-end w-full pr-10">
                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>

                            {/* ── Single Rotating Ring — dashed, spins slow ── */}
                            <div
                                className="absolute rounded-full animate-spin-slow"
                                style={{
                                    width: '200px', height: '200px',
                                    border: '1.5px dashed rgba(192,132,252,0.4)',
                                    top: 0, left: 0,
                                }}
                            />

                            {/* Fixed Badge — 24/7 — top center (0°) */}
                            <div className="absolute" style={{ top: '-16px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                                <div
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg"
                                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}
                                >
                                    <UserCheck className="w-3 h-3 text-emerald-300 shrink-0" />
                                    <span className="text-[11px] font-semibold text-white">24/7 Available</span>
                                </div>
                            </div>

                            {/* Fixed Badge — Emergency Support — bottom-left (~210°) */}
                            <div className="absolute" style={{ bottom: '4px', left: '-46px', zIndex: 20 }}>
                                <div
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg"
                                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}
                                >
                                    <Phone className="w-3 h-3 text-red-300 shrink-0" />
                                    <span className="text-[11px] font-semibold text-white">Emergency Support</span>
                                </div>
                            </div>

                            {/* Fixed Badge — Easy Booking — bottom-right (~330°) */}
                            <div className="absolute" style={{ bottom: '4px', right: '-46px', zIndex: 20 }}>
                                <div
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg"
                                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)' }}
                                >
                                    <Calendar className="w-3 h-3 text-blue-300 shrink-0" />
                                    <span className="text-[11px] font-semibold text-white">Easy Booking</span>
                                </div>
                            </div>

                            {/* Center Icon */}
                            <div
                                className="absolute rounded-full flex items-center justify-center animate-float"
                                style={{
                                    width: '96px', height: '96px',
                                    top: '52px', left: '52px',
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                                    boxShadow: '0 8px 32px rgba(109, 40, 217, 0.5)',
                                    border: '2px solid rgba(216,180,254,0.25)',
                                    backdropFilter: 'blur(12px)',
                                    zIndex: 10,
                                }}
                            >
                                <Stethoscope
                                    className="w-10 h-10 text-purple-100"
                                    style={{ strokeWidth: 1.5 }}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default Hero

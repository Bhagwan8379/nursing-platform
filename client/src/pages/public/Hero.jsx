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
        <section className="relative h-screen flex items-center px-4 overflow-hidden -mt-16 bg-slate-950">
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

            {/* Premium Dark Overlay to guarantee high readability of text on all screen sizes */}
            <div 
                className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-slate-950/40 md:from-slate-950/70 md:to-slate-950/20" 
                style={{ zIndex: 1 }} 
            />


            <div className="w-full max-w-7xl mx-auto relative pt-16 pb-12" style={{ zIndex: 2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    <div>
                        <Badge className="mb-4" variant="secondary">
                            🏥 Trusted Home Nursing Platform
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                            Professional Nursing Care{' '}
                            <span className="text-primary">At Your Home</span>
                        </h1>
                        <p className="text-white/80 text-lg mb-8 leading-relaxed">
                            Connect with verified, qualified nurses for at-home medical care.
                            From post-surgery care to elder care — we have you covered.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                size="lg"
                                onClick={() => navigate('/customer/register')}
                                className="text-white font-semibold shadow-lg hover:shadow-[0_0_24px_rgba(192,38,211,0.55)] hover:opacity-90 transition-all duration-300"
                                style={{ background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)' }}
                            >
                                Book a Nurse
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/services')}
                                className="border-white text-white bg-transparent hover:bg-white/10 hover:border-white transition-all duration-300"
                            >View Services </Button>
                        </div>

                        <div className="flex gap-8 mt-10">
                            {data.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-sm text-white/70">{stat.label}</p>
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
                                    border: '1.5px dashed rgba(192,132,252,0.5)',
                                    top: 0, left: 0,
                                }}
                            />

                            {/* Fixed Badge — 24/7 — top center (0°) */}
                            <div className="absolute" style={{ top: '-16px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg">
                                    <UserCheck className="w-3 h-3 text-green-300 shrink-0" />
                                    <span className="text-[11px] font-semibold text-white">24/7 Available</span>
                                </div>
                            </div>

                            {/* Fixed Badge — Emergency Support — bottom-left (~210°) */}
                            <div className="absolute" style={{ bottom: '4px', left: '-46px', zIndex: 20 }}>
                                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg">
                                    <Phone className="w-3 h-3 text-red-300 shrink-0" />
                                    <span className="text-[11px] font-semibold text-white">Emergency Support</span>
                                </div>
                            </div>

                            {/* Fixed Badge — Easy Booking — bottom-right (~330°) */}
                            <div className="absolute" style={{ bottom: '4px', right: '-46px', zIndex: 20 }}>
                                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg">
                                    <Calendar className="w-3 h-3 text-blue-300 shrink-0" />
                                    <span className="text-[11px] font-semibold text-white">Easy Booking</span>
                                </div>
                            </div>

                            <div
                                className="absolute rounded-full flex items-center justify-center animate-float"
                                style={{
                                    width: '96px', height: '96px',
                                    top: '52px', left: '52px', // Centered: (200 - 96) / 2 = 52px
                                    background: 'rgba(109, 40, 217, 0.92)',
                                    boxShadow: '0 8px 24px rgba(109, 40, 217, 0.3)',
                                    border: '2px solid rgba(216,180,254,0.3)',
                                    backdropFilter: 'blur(12px)',
                                    zIndex: 10,
                                }}
                            >
                                {/* Stethoscope icon — solid light purple */}
                                <Stethoscope
                                    className="w-10 h-10 text-purple-100"
                                    style={{
                                        strokeWidth: 1.5,
                                    }}
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






import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Stethoscope, Phone, Calendar, UserCheck } from 'lucide-react'
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
        <section className="bg-linear-to-br from-primary/30 via-background to-secondary/20 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    <div>
                        <Badge className="mb-4" variant="secondary">
                            🏥 Trusted Home Nursing Platform
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                            Professional Nursing Care{' '}
                            <span className="text-primary">At Your Home</span>
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Connect with verified, qualified nurses for at-home medical care.
                            From post-surgery care to elder care — we have you covered.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                size="lg"
                                onClick={() => navigate('/customer/register')}
                            >
                                Book a Nurse
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/services')}>View Services </Button>
                        </div>

                        <div className="flex gap-8 mt-10">
                            {data.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Animated Professional Right Side Image */}
                    <div className="hidden md:flex items-center justify-center relative">
                        <div className="relative w-80 h-80 bg-linear-to-br from-primary/10 via-background to-secondary/20 rounded-full flex items-center justify-center shadow-2xl animate-float backdrop-blur-sm border border-primary/20">
                            {/* DJ Style Rotating Ring Border */}
                            <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/60 animate-spin-slow"></div>

                            {/* Second Ring for DJ effect */}
                            <div className="absolute inset-2 rounded-full border-2 border-dotted border-secondary/50 animate-spin-reverse"></div>

                            {/* Main Icon */}
                            <div className="relative z-10">
                                <Stethoscope className="w-40 h-40 text-primary/40" />
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-4 right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-primary/20">
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium">24/7 Available</span>
                            </div>
                        </div>
                        <div className="absolute bottom-12 -left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg  border border-primary/20">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium">Emergency Support</span>
                            </div>
                        </div>
                        <div className="absolute top-24 -right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg animation-delay-500 border border-primary/20">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium">Flexible Booking</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default Hero






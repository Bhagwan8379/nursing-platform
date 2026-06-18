import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import React, { useEffect, useRef, useState } from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
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

    const contact = [
        { icon: Phone, text: '+91 98765 43210' },
        { icon: Mail, text: 'care@carenest.in' },
        { icon: MapPin, text: 'Aurangabad, Maharashtra' }
    ]

    const whychoose = [
        { text: 'Verified Professionals' },
        { text: '24/7 Availability' },
        { text: 'Quality Assured' }
    ]

    const forNurse = [
        { name: 'Register as Nurse', path: '/nurse/register' },
        { name: 'Nurse Login', path: '/nurse/login' },
        { name: 'How It Works', path: '/about' },
    ]

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ]

    return (
        <footer
            ref={sectionRef}
            className="relative text-white overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0a0518 0%, #07030f 100%)', borderTop: '1px solid rgba(139,92,246,0.12)' }}
        >
            {/* Top decorative gradient line */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.5) 30%, rgba(192,132,252,0.4) 50%, rgba(147,51,234,0.5) 70%, transparent)' }}
            />

            <div
                className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5 transition-all duration-1000 ease-out transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

                    {/* Brand Section */}
                    <div className="lg:col-span-1 flex flex-col justify-start gap-0">
                        <div className="flex items-center gap-2.5 mb-2 group">
                            <div
                                className="p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-105"
                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 2px 8px rgba(147,51,234,0.4)' }}
                            >
                                <Heart className="w-4 h-4 text-white fill-white/20" />
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight font-heading">
                                CareNest
                            </span>
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed mb-3 max-w-[220px]">
                            Professional at-home nursing services. Connecting patients with verified, trusted nurses.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-1.5">
                            {contact.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 group cursor-default">
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(147,51,234,0.15)' }}>
                                        <item.icon className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-xs mb-5 uppercase tracking-widest text-gray-200">
                            Quick Links
                        </h3>
                        <ul className="space-y-1.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-1.5 text-gray-400 hover:text-purple-300 transition-all duration-300 text-xs font-medium"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Nurses */}
                    <div>
                        <h3 className="font-bold text-xs mb-3 uppercase tracking-widest text-gray-200">
                            For Nurses
                        </h3>
                        <ul className="space-y-1.5">
                            {forNurse.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-1.5 text-gray-400 hover:text-purple-300 transition-all duration-300 text-xs font-medium"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Why Choose Us trust items */}
                    <div>
                        <h3 className="font-bold text-xs mb-5 uppercase tracking-widest text-gray-200">
                            Why Choose Us
                        </h3>
                        <div className="space-y-1.5">
                            {whychoose.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span className="text-xs font-medium text-gray-400">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="my-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-gray-600 font-medium">
                        © {currentYear} CareNest. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <Link to="/privacy" className="text-[11px] text-gray-600 hover:text-purple-400 transition-colors font-medium">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-[11px] text-gray-600 hover:text-purple-400 transition-colors font-medium">
                            Terms of Service
                        </Link>
                        <Link to="/cookies" className="text-[11px] text-gray-600 hover:text-purple-400 transition-colors font-medium">
                            Cookie Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

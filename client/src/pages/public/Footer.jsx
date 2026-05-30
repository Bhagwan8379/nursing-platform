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
            className="relative bg-slate-950 text-white overflow-hidden border-t border-purple-900/20"
        >

            <div 
                className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 transition-all duration-1000 ease-out transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

                    {/* Brand Section */}
                    <div className="lg:col-span-1 flex flex-col justify-start">
                        <div className="flex items-center gap-2 mb-3.5 group">
                            <div className="bg-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-950/40 transition-transform duration-300 group-hover:scale-105">
                                <Heart className="w-4 h-4 text-white fill-white/10" />
                            </div>
                            <span className="font-bold text-xl text-purple-400 tracking-tight">
                                CareNest
                            </span>
                        </div>
                        
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">
                            Professional at-home nursing services. Connecting patients with verified, trusted nurses.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            {contact.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-300 group cursor-default">
                                    <item.icon className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-300 transition-colors shrink-0" />
                                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-xs mb-4 uppercase tracking-wider text-white relative inline-block">
                            Quick Links
                            <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-purple-600 rounded-full" />
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-1 text-gray-400 hover:text-purple-300 hover:translate-x-0.5 transition-all duration-300 text-xs"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-400" />
                                        <span className="font-medium">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Nurses */}
                    <div>
                        <h3 className="font-bold text-xs mb-4 uppercase tracking-wider text-white relative inline-block">
                            For Nurses
                            <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-purple-600 rounded-full" />
                        </h3>
                        <ul className="space-y-2">
                            {forNurse.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-1 text-gray-400 hover:text-purple-300 hover:translate-x-0.5 transition-all duration-300 text-xs"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-400" />
                                        <span className="font-medium">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Why Choose Us trust items */}
                    <div>
                        <h3 className="font-bold text-xs mb-4 uppercase tracking-wider text-white relative inline-block">
                            Why Choose Us
                            <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-purple-600 rounded-full" />
                        </h3>
                        <div className="space-y-2">
                            {whychoose.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-300">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span className="text-xs font-medium text-gray-300">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator className="my-5 bg-white/10" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-gray-500 font-medium">
                        © {currentYear} CareNest. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="text-[11px] text-gray-500 hover:text-purple-400 transition-colors font-medium">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-[11px] text-gray-500 hover:text-purple-400 transition-colors font-medium">
                            Terms of Service
                        </Link>
                        <Link to="/cookies" className="text-[11px] text-gray-500 hover:text-purple-400 transition-colors font-medium">
                            Cookie Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

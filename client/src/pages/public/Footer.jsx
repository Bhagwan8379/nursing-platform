// src/components/shared/Footer.jsx

import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const contact = [
        { icon: Phone, text: '+91 98765 43210' },
        { icon: Mail, text: 'care@carenest.in' },
        { icon: MapPin, text: 'Aurangabad, Maharashtra' }
    ]

    const whychoose = [
        { text: '✓ Verified Professionals' },
        { text: '✓ 24/7 Availability' },
        { text: '✓ Quality Assured' }
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
        <footer className="relative bg-linear-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
            {/* Decorative Elements - Subtle */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[50px_50px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-linear-to-br from-violet-500 to-purple-600 p-1.5 rounded-lg shadow-lg">
                                <Heart className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-linear-to-br from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                CareNest
                            </span>
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed mb-3">
                            Professional at-home nursing services. Connecting patients with verified nurses.
                        </p>

                        {/* Contact Info - Compact */}
                        <div className="space-y-1.5">
                            {contact.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-300">
                                    <item.icon className="w-3.5 h-3.5 text-violet-400" />
                                    <span className="text-xs">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3 relative inline-block">
                            Quick Links
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-linear-to-br from-violet-500 to-purple-500 rounded-full mt-0.5" />
                        </h3>
                        <ul className="space-y-1.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-1.5 text-gray-300 hover:text-violet-400 transition-all duration-300 text-xs"
                                    >
                                        <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Nurses */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3 relative inline-block">
                            For Nurses
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-linear-to-br from-violet-500 to-purple-500 rounded-full mt-0.5" />
                        </h3>
                        <ul className="space-y-1.5">
                            {forNurse.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-1.5 text-gray-300 hover:text-violet-400 transition-all duration-300 text-xs"
                                    >
                                        <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trust Badges - Compact */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3 relative inline-block">
                            Why Choose Us
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-linear-to-br from-violet-500 to-purple-500 rounded-full mt-0.5" />
                        </h3>
                        <div className="space-y-2">
                            {whychoose.map((item, idx) => (
                                <p key={idx} className="text-xs text-gray-300">
                                    {item.text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator className="my-5 bg-gray-700" />

                {/* Bottom Bar - Compact */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-gray-400">
                        © {currentYear} CareNest. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="text-xs text-gray-400 hover:text-violet-400 transition-colors">
                            Privacy
                        </Link>
                        <Link to="/terms" className="text-xs text-gray-400 hover:text-violet-400 transition-colors">
                            Terms
                        </Link>
                        <Link to="/cookies" className="text-xs text-gray-400 hover:text-violet-400 transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer






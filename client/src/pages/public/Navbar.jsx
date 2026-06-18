import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Heart, ChevronDown, UserPlus, LogIn, Stethoscope, Users, Shield, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const patient = useSelector(state => state.auth.patient)
    const nurse = useSelector(state => state.auth.nurse)
    const admin = useSelector(state => state.auth.admin)

    const isLoggedIn = !!(patient || nurse || admin)

    const getDashboardPath = () => {
        if (patient) return '/customer/dashboard'
        if (nurse) return '/nurse/dashboard'
        if (admin) return '/admin/dashboard'
        return '/'
    }

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ]

    const isActive = (path) => location.pathname === path

    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const isHomePage = location.pathname === '/'
    const showSolidNavbar = scrolled || !isHomePage

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                background: showSolidNavbar
                    ? 'rgba(255, 255, 255, 0.97)'
                    : 'transparent',
                borderBottom: showSolidNavbar ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
                boxShadow: showSolidNavbar
                    ? '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 4px 16px -4px rgba(109, 40, 217, 0.08)'
                    : 'none',
                backdropFilter: showSolidNavbar ? 'blur(16px)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div
                            className="p-1.5 rounded-lg transition-all duration-300 group-hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 2px 8px rgba(147, 51, 234, 0.35)' }}
                        >
                            <Heart className="w-4 h-4 text-white fill-white/30" />
                        </div>
                        <span className={`font-bold text-[17px] tracking-tight transition-colors duration-500 font-heading ${showSolidNavbar ? 'text-gray-900' : 'text-white'}`}>
                            CareNest
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-0.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                    isActive(link.path)
                                        ? showSolidNavbar
                                            ? 'text-purple-700'
                                            : 'text-white'
                                        : showSolidNavbar
                                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            : 'text-white/75 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span
                                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: '20px',
                                            background: showSolidNavbar
                                                ? 'linear-gradient(90deg, #9333ea, #7c3aed)'
                                                : 'white',
                                        }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        {!isLoggedIn ? (
                            <>
                                {/* Login Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`gap-1.5 font-medium transition-all duration-300 ${
                                                showSolidNavbar
                                                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            <LogIn className="w-3.5 h-3.5" />
                                            Login
                                            <ChevronDown className="w-3 h-3 opacity-60" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border border-gray-100/80 p-1">
                                        <DropdownMenuItem
                                            onClick={() => navigate('/customer/login')}
                                            className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
                                        >
                                            <Users className="w-4 h-4 shrink-0" />
                                            <span className="text-sm font-medium">Login as Patient</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => navigate('/nurse/login')}
                                            className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
                                        >
                                            <Stethoscope className="w-4 h-4 shrink-0" />
                                            <span className="text-sm font-medium">Login as Nurse</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1" />
                                        <DropdownMenuItem
                                            onClick={() => navigate('/admin/login')}
                                            className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-slate-50 hover:text-slate-700 gap-2.5"
                                        >
                                            <Shield className="w-4 h-4 shrink-0" />
                                            <span className="text-sm font-medium">Admin Login</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Register Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="sm"
                                            className="gap-1.5 text-white font-semibold rounded-lg transition-all duration-300 border-none"
                                            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 2px 8px rgba(147, 51, 234, 0.3)' }}
                                        >
                                            <UserPlus className="w-3.5 h-3.5" />
                                            Register
                                            <ChevronDown className="w-3 h-3 opacity-80" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border border-gray-100/80 p-1">
                                        <DropdownMenuItem
                                            onClick={() => navigate('/customer/register')}
                                            className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
                                        >
                                            <Users className="w-4 h-4 shrink-0" />
                                            <span className="text-sm font-medium">Register as Patient</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => navigate('/nurse/register')}
                                            className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
                                        >
                                            <Stethoscope className="w-4 h-4 shrink-0" />
                                            <span className="text-sm font-medium">Register as Nurse</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() => navigate(getDashboardPath())}
                                className="gap-1.5 text-white font-semibold rounded-lg transition-all duration-300 border-none"
                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 2px 8px rgba(147, 51, 234, 0.3)' }}
                            >
                                Go to Dashboard
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            showSolidNavbar
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-white hover:bg-white/10'
                        }`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen
                            ? <X className="w-5 h-5" />
                            : <Menu className="w-5 h-5" />
                        }
                    </button>

                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div
                        className="md:hidden py-3 border-t animate-in slide-in-from-top-2"
                        style={{
                            borderColor: showSolidNavbar ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.12)',
                            background: showSolidNavbar ? 'rgba(255,255,255,0.98)' : 'rgba(15, 10, 40, 0.92)',
                        }}
                    >
                        <div className="flex flex-col gap-0.5 pb-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                        isActive(link.path)
                                            ? showSolidNavbar
                                                ? 'text-purple-700 bg-purple-50 font-semibold'
                                                : 'text-white bg-white/10 font-semibold'
                                            : showSolidNavbar
                                                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-3 mt-1.5 border-t" style={{ borderColor: showSolidNavbar ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.1)' }}>
                                {!isLoggedIn ? (
                                    <>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-2 ${showSolidNavbar ? 'text-gray-400' : 'text-white/40'}`}>
                                            Login
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-start gap-2.5 mb-1 text-sm font-medium ${showSolidNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                                            onClick={() => { navigate('/customer/login'); setIsOpen(false) }}
                                        >
                                            <Users className="w-4 h-4" />
                                            Login as Patient
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-start gap-2.5 mb-1 text-sm font-medium ${showSolidNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                                            onClick={() => { navigate('/nurse/login'); setIsOpen(false) }}
                                        >
                                            <Stethoscope className="w-4 h-4" />
                                            Login as Nurse
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-start gap-2.5 mb-3 text-sm font-medium ${showSolidNavbar ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                                            onClick={() => { navigate('/admin/login'); setIsOpen(false) }}
                                        >
                                            <Shield className="w-4 h-4" />
                                            Admin Login
                                        </Button>

                                        <p className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-2 ${showSolidNavbar ? 'text-gray-400' : 'text-white/40'}`}>
                                            Register
                                        </p>
                                        <Button
                                            size="sm"
                                            className="w-full justify-start gap-2.5 mb-1.5 text-white font-semibold border-none"
                                            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                                            onClick={() => { navigate('/customer/register'); setIsOpen(false) }}
                                        >
                                            <Users className="w-4 h-4" />
                                            Register as Patient
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`w-full justify-start gap-2.5 font-medium ${showSolidNavbar ? 'border-purple-200 text-purple-700 hover:bg-purple-50' : 'border-white/20 text-white hover:bg-white/10'}`}
                                            onClick={() => { navigate('/nurse/register'); setIsOpen(false) }}
                                        >
                                            <Stethoscope className="w-4 h-4" />
                                            Register as Nurse
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="sm"
                                        className="w-full gap-2 text-white font-semibold border-none"
                                        style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                                        onClick={() => { navigate(getDashboardPath()); setIsOpen(false) }}
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar

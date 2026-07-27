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

    const isHomePage = location.pathname === '/'

    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const onScroll = () => {
            // On home page, stay transparent until we approach the end of the 400vh scroll (approx 2.8x viewport height)
            const threshold = isHomePage ? window.innerHeight * 2.8 : 10
            setScrolled(window.scrollY > threshold)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll() // Initial check
        return () => window.removeEventListener('scroll', onScroll)
    }, [isHomePage])

    // Determine if the navbar overlay is visually on a dark theme area (e.g. Hero frames)
    const isNavbarDark = isHomePage && !scrolled

    // Contextual glassmorphic styling
    let navbarBg = 'transparent'
    let navbarBorder = 'none'
    let navbarShadow = 'none'
    let navbarBlur = 'none'
    let textLogoClass = 'text-white'
    let navButtonClass = 'text-white/80 hover:text-white hover:bg-white/5'

    if (isNavbarDark) {
        navbarBg = 'transparent'
        navbarBorder = 'none'
        navbarShadow = 'none'
        navbarBlur = 'none'
        textLogoClass = 'text-white'
        navButtonClass = 'text-white/80 hover:text-white hover:bg-white/5'
    } else {
        // Scrolled or on other pages: white glassmorphism
        navbarBg = 'rgba(255, 255, 255, 0.75)'
        navbarBorder = '1px solid rgba(0, 0, 0, 0.04)'
        navbarShadow = '0 4px 20px rgba(0, 0, 0, 0.02)'
        navbarBlur = 'blur(14px)'
        textLogoClass = 'text-gray-900'
        navButtonClass = 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/50'
    }

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out"
                style={{
                    background: navbarBg,
                    borderBottom: navbarBorder,
                    boxShadow: navbarShadow,
                    backdropFilter: navbarBlur,
                    WebkitBackdropFilter: navbarBlur,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div
                                className="p-1 rounded-lg transition-all duration-300 group-hover:scale-105"
                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                            >
                                <Heart className="w-3.5 h-3.5 text-white fill-white/20" />
                            </div>
                            <span className={`font-bold text-base tracking-tight font-heading ${textLogoClass}`}>
                                CareNest
                            </span>
                        </Link>

                        {/* Desktop Nav Links (recent.design Style Dot Indicator) */}
                        <div className="hidden md:flex items-center gap-4">
                            {navLinks.map((link) => {
                                const active = isActive(link.path)
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`relative pr-3 py-1 text-sm font-medium transition-all duration-200 ${
                                            isNavbarDark
                                                ? active
                                                    ? 'text-white'
                                                    : 'text-white/60 hover:text-white'
                                                : active
                                                    ? 'text-purple-700 font-semibold'
                                                    : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {link.name}
                                        {active && (
                                            <span
                                                className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-pulse"
                                                style={{
                                                    background: isNavbarDark ? '#c084fc' : '#9333ea',
                                                }}
                                            />
                                        )}
                                    </Link>
                                )
                            })}
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
                                                className={`gap-1 font-medium transition-all duration-200 cursor-pointer h-8 rounded-lg text-xs ${navButtonClass}`}
                                            >
                                                <LogIn className="w-3.5 h-3.5" />
                                                Login
                                                <ChevronDown className="w-3 h-3 opacity-60" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border border-gray-100/80 p-1">
                                            <DropdownMenuItem
                                                onClick={() => navigate('/customer/login')}
                                                className="cursor-pointer rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
                                            >
                                                <Users className="w-4 h-4 shrink-0" />
                                                <span className="text-sm font-medium">Login as Patient</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => navigate('/nurse/login')}
                                                className="cursor-pointer rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
                                            >
                                                <Stethoscope className="w-4 h-4 shrink-0" />
                                                <span className="text-sm font-medium">Login as Nurse</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="my-1" />
                                            <DropdownMenuItem
                                                onClick={() => navigate('/admin/login')}
                                                className="cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-slate-700 gap-2.5"
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
                                                className="gap-1 text-white font-semibold rounded-lg transition-all duration-200 border-none cursor-pointer h-8 px-3 text-xs"
                                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                Register
                                                <ChevronDown className="w-3 h-3 opacity-80" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border border-gray-100/80 p-1">
                                            <DropdownMenuItem
                                                onClick={() => navigate('/customer/register')}
                                                className="cursor-pointer rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
                                            >
                                                <Users className="w-4 h-4 shrink-0" />
                                                <span className="text-sm font-medium">Register as Patient</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => navigate('/nurse/register')}
                                                className="cursor-pointer rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-700 gap-2.5"
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
                                    className="gap-1 text-white font-semibold rounded-lg transition-all duration-200 border-none cursor-pointer h-8 px-3 text-xs"
                                    style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className={`md:hidden p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isNavbarDark
                                    ? 'text-white hover:bg-white/5'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setIsOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                    </div>
                </div>
            </nav>

            {/* ──────────────────────────────────────────────────────────────────────── */}
            {/* MOBILE SIDE DRAWER (Styled slide-in matching recent.design side-panel)   */}
            {/* ──────────────────────────────────────────────────────────────────────── */}
            
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-45 transition-opacity duration-300 md:hidden ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Side Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[290px] sm:w-[310px] bg-slate-950/98 border-l border-white/5 shadow-2xl z-50 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-out md:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div>
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                            <div
                                className="p-1 rounded-lg"
                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                            >
                                <Heart className="w-3.5 h-3.5 text-white fill-white/20" />
                            </div>
                            <span className="font-bold text-base text-white font-heading tracking-tight">
                                CareNest
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Links with recent.design Dot */}
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.path)
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`relative px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                                        active
                                            ? 'bg-white/5 text-white font-semibold'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                    {!isLoggedIn ? (
                        <>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-0.5">
                                Account Access
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-center text-[11px] h-9 border border-white/10 text-white hover:bg-white/5 rounded-lg cursor-pointer"
                                    onClick={() => { navigate('/customer/login'); setIsOpen(false) }}
                                >
                                    Patient Login
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-center text-[11px] h-9 border border-white/10 text-white hover:bg-white/5 rounded-lg cursor-pointer"
                                    onClick={() => { navigate('/nurse/login'); setIsOpen(false) }}
                                >
                                    Nurse Login
                                </Button>
                            </div>

                            <Button
                                size="sm"
                                className="w-full justify-center text-[11px] h-9 text-white font-bold border-none rounded-lg cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                                onClick={() => { navigate('/customer/register'); setIsOpen(false) }}
                            >
                                Register as Patient
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-center text-[11px] h-9 border-white/10 text-white/80 hover:bg-white/5 hover:text-white rounded-lg cursor-pointer"
                                onClick={() => { navigate('/nurse/register'); setIsOpen(false) }}
                            >
                                Register as Nurse
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            className="w-full gap-2 text-white font-bold h-10 border-none rounded-lg cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                            onClick={() => { navigate(getDashboardPath()); setIsOpen(false) }}
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navbar

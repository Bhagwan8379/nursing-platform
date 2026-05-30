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
                background: showSolidNavbar ? 'white' : 'transparent',
                borderBottom: showSolidNavbar ? '1px solid rgba(229, 231, 235, 0.5)' : 'none',
                boxShadow: showSolidNavbar ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-linear-to-br from-primary to-primary/80 p-1.5 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                            <Heart className="w-5 h-5 text-white fill-white/20" />
                        </div>
                        <span className={`font-bold text-xl tracking-wide transition-colors duration-500 ${showSolidNavbar ? 'text-gray-900' : 'text-white'}`}>
                            CareNest
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                    isActive(link.path)
                                        ? showSolidNavbar ? 'text-purple-700 font-semibold' : 'text-white font-semibold'
                                        : showSolidNavbar ? 'text-gray-600 hover:text-purple-700' : 'text-white/70 hover:text-white'
                                }`}
                            >
                                {link.name}
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
                                            variant="outline"
                                            size="sm"
                                            className={`transition-all duration-300 ${
                                                showSolidNavbar
                                                    ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
                                                    : 'border-white/30 text-white bg-white/10 hover:bg-white/20 hover:border-white/50'
                                            }`}
                                        >
                                            <LogIn className="w-4 h-4 mr-1" />
                                            Login
                                            <ChevronDown className="w-3 h-3 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem
                                            onClick={() => navigate('/customer/login')}
                                            className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Login as Patient
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => navigate('/nurse/login')}
                                            className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Stethoscope className="w-4 h-4 mr-2" />
                                            Login as Nurse
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => navigate('/admin/login')}
                                            className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Shield className="w-4 h-4 mr-2" />
                                            Admin Login
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Register Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="sm"
                                            className="text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-purple-600 hover:bg-purple-700 border-none"
                                        >
                                            <UserPlus className="w-4 h-4 mr-1" />
                                            Register
                                            <ChevronDown className="w-3 h-3 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem
                                            onClick={() => navigate('/customer/register')}
                                            className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Register as Patient
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => navigate('/nurse/register')}
                                            className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Stethoscope className="w-4 h-4 mr-2" />
                                            Register as Nurse
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() => navigate(getDashboardPath())}
                                className="text-white font-bold flex items-center gap-1.5 transition-all duration-300 bg-purple-600 hover:bg-purple-700 border-none"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            showSolidNavbar ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                        }`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen
                            ? <X className="w-5 h-5" />
                            : <Menu className="w-5 h-5" />
                        }
                    </button>

                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t animate-in slide-in-from-top-2" style={{ borderColor: 'rgba(160,80,255,0.18)' }}>
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                        isActive(link.path)
                                            ? showSolidNavbar ? 'text-purple-700 font-semibold bg-purple-50' : 'text-white font-semibold bg-white/10'
                                            : showSolidNavbar ? 'text-gray-600 hover:text-purple-700 hover:bg-purple-50' : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                                <div className="pt-3 mt-2 border-t" style={{ borderColor: 'rgba(160,80,255,0.18)' }}>
                                {!isLoggedIn ? (
                                    <>
                                        <div className="px-2 mb-2">
                                            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                Login
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start gap-2 mb-1"
                                            onClick={() => {
                                                navigate('/customer/login')
                                                setIsOpen(false)
                                            }}
                                        >
                                            <Users className="w-4 h-4" />
                                            Login as Patient
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start gap-2 mb-1"
                                            onClick={() => {
                                                navigate('/nurse/login')
                                                setIsOpen(false)
                                            }}
                                        >
                                            <Stethoscope className="w-4 h-4" />
                                            Login as Nurse
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start gap-2 mb-3"
                                            onClick={() => {
                                                navigate('/admin/login')
                                                setIsOpen(false)
                                            }}
                                        >
                                            <Shield className="w-4 h-4" />
                                            Admin Login
                                        </Button>

                                        <div className="px-2 mb-2 mt-2">
                                            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                                                Register
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full justify-start gap-2 mb-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 border-none"
                                            onClick={() => {
                                                navigate('/customer/register')
                                                setIsOpen(false)
                                            }}
                                        >
                                            <Users className="w-4 h-4" />
                                            Register as Patient
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start gap-2"
                                            onClick={() => {
                                                navigate('/nurse/register')
                                                setIsOpen(false)
                                            }}
                                        >
                                            <Stethoscope className="w-4 h-4" />
                                            Register as Nurse
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="sm"
                                        className="w-full text-white font-bold flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 border-none"
                                        onClick={() => {
                                            navigate(getDashboardPath())
                                            setIsOpen(false)
                                        }}
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



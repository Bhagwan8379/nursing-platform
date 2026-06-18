import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Heart, Calendar, Clock, MapPin, User, Phone, FileText, CheckCircle2,
    XCircle, ShieldAlert, Award, Star, DollarSign, LogOut, ArrowRight,
    Search, Filter, Plus, Check, RefreshCw, Eye, EyeOff, Camera, Lock,
    Key, Mail, Shield, ChevronRight, UserCheck, AlertCircle, ShoppingBag,
    Grid, Activity, Sparkles
} from 'lucide-react'
import { logoutPatient } from '@/redux/slice/authSlice'
import { useLogoutPatientMutation } from '@/redux/apis/authApi'
import {
    useGetAllServicesQuery,
    useCreateBookingMutation,
    useGetMyBookingsQuery,
    useCancelBookingMutation,
    useCreatePaymentOrderMutation,
    useVerifyPaymentMutation,
    useGetCustomerInfoQuery,
    useUpdateCustomerInfoMutation,
    useUpdateCustomerPasswordMutation,
    useSubmitFeedbackMutation
} from '@/redux/apis/bookingApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const PatientDashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const patient = useSelector(state => state.auth.patient)

    const [logoutPatientMutation] = useLogoutPatientMutation()

    // Queries & Mutations
    const { data: servicesData, isLoading: servicesLoading } = useGetAllServicesQuery()
    const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useGetMyBookingsQuery()
    const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useGetCustomerInfoQuery(undefined, { 
        skip: !patient,
        pollingInterval: 15000
    })
    
    const [createBooking, { isLoading: bookingCreating }] = useCreateBookingMutation()
    const [cancelBooking] = useCancelBookingMutation()
    const [createPaymentOrder] = useCreatePaymentOrderMutation()
    const [verifyPayment] = useVerifyPaymentMutation()
    const [updateCustomerInfo, { isLoading: profileUpdating }] = useUpdateCustomerInfoMutation()
    const [updateCustomerPassword, { isLoading: passwordUpdating }] = useUpdateCustomerPasswordMutation()
    const [submitFeedback, { isLoading: feedbackSubmitting }] = useSubmitFeedbackMutation()

    // Dashboard State
    const [activeTab, setActiveTab] = useState('dashboard') // dashboard, bookings, profile
    const [bookingFilter, setBookingFilter] = useState('all') // all, active, completed, cancelled
    const [searchTerm, setSearchTerm] = useState('')

    // Booking Modals
    const [selectedService, setSelectedService] = useState(null)
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [isCancelOpen, setIsCancelOpen] = useState(false)
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [cancelReason, setCancelReason] = useState('')
    const [paymentSimulationBooking, setPaymentSimulationBooking] = useState(null)

    // Form States
    const [bookingFormData, setBookingFormData] = useState({
        patientName: '',
        patientMobile: '',
        patientAge: '',
        patientGender: 'Male',
        street: '',
        city: '',
        state: '',
        pin: '',
        preferredDate: '',
        timeSlot: 'Morning (8 AM - 12 PM)',
        nurseGenderPreference: 'any',
        paymentMode: 'online',
        customerNote: ''
    })

    // Profile Details Update State
    const [profileForm, setProfileForm] = useState({
        name: '',
        mobile: ''
    })
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null)
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')
    const fileInputRef = useRef(null)

    // Password Update State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showCurrentPass, setShowCurrentPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    // Platform Feedback Form State
    const [feedbackForm, setFeedbackForm] = useState({
        rating: 5,
        comment: ''
    })

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault()
        if (!feedbackForm.comment.trim()) {
            toast.error('Please write a comment first')
            return
        }
        try {
            await submitFeedback({
                rating: feedbackForm.rating,
                comment: feedbackForm.comment.trim()
            }).unwrap()
            toast.success('Thank you for your feedback! The platform managers will review it.')
            setFeedbackForm({ rating: 5, comment: '' })
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to submit feedback')
        }
    }

    // Synchronize current profile form inputs
    const liveProfile = profileData?.result || patient

    useEffect(() => {
        if (liveProfile) {
            setProfileForm({
                name: liveProfile.name || '',
                mobile: liveProfile.mobile || ''
            })
        }
    }, [profileData, patient])

    const handleLogout = async () => {
        try {
            await logoutPatientMutation().unwrap()
            dispatch(logoutPatient())
            toast.success('Logged out successfully')
            navigate('/')
        } catch (error) {
            toast.error('Logout failed')
        }
    }

    const handleOpenBooking = (service) => {
        setSelectedService(service)
        setBookingFormData({
            ...bookingFormData,
            patientName: liveProfile?.name || '',
            patientMobile: liveProfile?.mobile || '',
            street: '',
            city: '',
            state: '',
            pin: '',
            preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] // tomorrow
        })
        setIsBookingOpen(true)
    }

    useEffect(() => {
        if (!patient) {
            navigate('/customer/login')
            return
        }

        // Auto-open booking modal if arriving from the public services page
        if (location.state?.selectedServiceId && servicesData?.result) {
            const targetService = servicesData.result.find(s => 
                s._id === location.state.selectedServiceId || 
                s.name.toLowerCase() === location.state.selectedServiceName?.toLowerCase()
            )
            if (targetService) {
                handleOpenBooking(targetService)
                // Clear the state so it doesn't pop up again on refresh
                navigate(location.pathname, { replace: true, state: {} })
            }
        }
    }, [patient, navigate, location.state, servicesData])

    // Booking submit logic
    const handleBookingSubmit = async (e) => {
        e.preventDefault()
        try {
            const bookingPayload = {
                serviceId: selectedService._id,
                preferredDate: bookingFormData.preferredDate,
                timeSlot: bookingFormData.timeSlot,
                nurseGenderPreference: bookingFormData.nurseGenderPreference,
                paymentMode: bookingFormData.paymentMode,
                totalAmount: selectedService.price,
                customerNote: bookingFormData.customerNote,
                patientDetails: {
                    name: bookingFormData.patientName,
                    mobile: bookingFormData.patientMobile,
                    age: Number(bookingFormData.patientAge),
                    gender: bookingFormData.patientGender
                },
                serviceAddress: {
                    street: bookingFormData.street,
                    city: bookingFormData.city,
                    state: bookingFormData.state,
                    pin: bookingFormData.pin
                }
            }

            await createBooking(bookingPayload).unwrap()
            toast.success('Booking requested successfully!')
            setIsBookingOpen(false)
            refetchBookings()
            
            // Navigate to Bookings tab directly
            setActiveTab('bookings')
            setBookingFilter('active')
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to submit booking request')
        }
    }

    // Booking Cancel logic
    const handleCancelRequest = async (e) => {
        e.preventDefault()
        try {
            await cancelBooking({
                bookingId: bookingToCancel,
                cancellationReason: cancelReason
            }).unwrap()
            toast.success('Booking cancelled successfully')
            setIsCancelOpen(false)
            setCancelReason('')
            refetchBookings()
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to cancel booking')
        }
    }

    // Payment Sandbox Simulated handlers
    const handlePayNow = async (booking) => {
        try {
            toast.info('Initiating secure payment gateway...')
            const orderData = await createPaymentOrder({ bookingId: booking._id }).unwrap()

            setPaymentSimulationBooking({
                bookingId: booking._id,
                orderId: orderData.order.id,
                amount: booking.totalAmount
            })
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to create payment order')
        }
    }

    const completePaymentVerification = async (simulatedSuccess = true) => {
        if (!paymentSimulationBooking) return
        try {
            if (simulatedSuccess) {
                const payload = {
                    bookingId: paymentSimulationBooking.bookingId,
                    razorpayOrderId: paymentSimulationBooking.orderId,
                    razorpayPaymentId: 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase(),
                    razorpaySignature: 'sig_' + Math.random().toString(36).substring(2, 15)
                }

                await verifyPayment(payload).unwrap()
                toast.success('Payment completed successfully!')
                refetchBookings()
            } else {
                toast.error('Payment cancelled/failed')
            }
            setPaymentSimulationBooking(null)
        } catch (error) {
            toast.error(error?.data?.message || 'Verification failed')
        }
    }

    // Profile Details Update Logic
    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!profileForm.name.trim() || !profileForm.mobile.trim()) {
                toast.error('Name and Mobile number are required')
                return
            }

            const formData = new FormData()
            formData.append('name', profileForm.name.trim())
            formData.append('mobile', profileForm.mobile.trim())
            if (selectedAvatarFile) {
                formData.append('profilePhoto', selectedAvatarFile)
            }

            await updateCustomerInfo(formData).unwrap()
            toast.success('Profile updated successfully!')
            setSelectedAvatarFile(null)
            refetchProfile()
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update profile details')
        }
    }

    // Password Update Logic
    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        const { currentPassword, newPassword, confirmPassword } = passwordForm

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all password fields')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        try {
            await updateCustomerPassword({ currentPassword, newPassword }).unwrap()
            toast.success('Password updated successfully!')
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update password')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'nurse_assigned': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'nurse_accepted': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
            case 'on_route': return 'bg-sky-50 text-sky-700 border-sky-200'
            case 'in_progress': return 'bg-teal-50 text-teal-700 border-teal-200'
            case 'complete': return 'bg-green-50 text-green-700 border-green-200'
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200'
            default: return 'bg-slate-50 text-slate-700 border-slate-200'
        }
    }

    // Dynamic stats computation
    const totalBookingsCount = bookingsData?.result?.length || 0
    const activeBookingsCount = bookingsData?.result?.filter(b => 
        ['pending', 'nurse_assigned', 'nurse_accepted', 'on_route', 'in_progress'].includes(b.status)
    ).length || 0
    const completedBookingsCount = bookingsData?.result?.filter(b => b.status === 'complete').length || 0
    const cancelledBookingsCount = bookingsData?.result?.filter(b => b.status === 'cancelled').length || 0

    // Filtered bookings selector
    const filteredBookings = bookingsData?.result?.filter(booking => {
        // Text search match
        const matchesSearch = 
            booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.serviceId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.patientDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())

        // Tab Filter match
        let matchesTab = true
        if (bookingFilter === 'active') {
            matchesTab = ['pending', 'nurse_assigned', 'nurse_accepted', 'on_route', 'in_progress'].includes(booking.status)
        } else if (bookingFilter === 'completed') {
            matchesTab = booking.status === 'complete'
        } else if (bookingFilter === 'cancelled') {
            matchesTab = booking.status === 'cancelled'
        }

        return matchesSearch && matchesTab
    }) || []

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row text-slate-800">
            {/* Elegant Sidebar Panel */}
            <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col shrink-0">
                {/* Brand / Profile Info Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-6 self-start">
                        <div className="bg-linear-to-br from-primary to-primary/80 p-1.5 rounded-lg shadow-sm">
                            <Heart className="w-5 h-5 text-white fill-white/20" />
                        </div>
                        <span className="font-bold text-lg bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            CareNest Portal
                        </span>
                    </div>

                    {/* Profile Avatar Widget */}
                    <div className="relative group mb-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-100 flex items-center justify-center">
                            {liveProfile?.profilePhoto ? (
                                <img 
                                    src={liveProfile.profilePhoto} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-slate-400" />
                            )}
                        </div>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/95 transition-all"
                            title="Update Profile"
                        >
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-800 line-clamp-1">{liveProfile?.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 break-all">{liveProfile?.email}</p>
                    <span className="mt-2.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-wider">
                        Patient / Customer
                    </span>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4 space-y-1.5">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            activeTab === 'dashboard'
                                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Grid className="w-4 h-4 shrink-0" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('bookings')
                            setBookingFilter('all')
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            activeTab === 'bookings'
                                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 shrink-0" />
                            My Bookings
                        </span>
                        {activeBookingsCount > 0 && (
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                activeTab === 'bookings' ? 'bg-white text-primary' : 'bg-primary text-white'
                            }`}>
                                {activeBookingsCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            activeTab === 'profile'
                                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <User className="w-4 h-4 shrink-0" />
                        My Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            activeTab === 'feedback'
                                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Star className="w-4 h-4 shrink-0" />
                        Feedback & Reviews
                    </button>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Logout Session
                    </button>
                </div>
            </aside>

            {/* Central Content Panel */}
            <main className="flex-1 flex flex-col min-w-0 p-6 md:p-10 max-h-screen overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* 1. Dashboard Tab Content */}
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-8"
                        >
                            {/* Header Greeting Banner */}
                            <div className="bg-linear-to-r from-primary/10 to-teal-500/10 p-8 rounded-3xl border border-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-1 text-center md:text-left">
                                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                        Namaskar, {liveProfile?.name}!
                                    </h1>
                                    <p className="text-muted-foreground mt-1 text-sm max-w-lg">
                                        Welcome to your clinical care dashboard. Book certified care or track your medical schedulers instantly.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => navigate('/services')}
                                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10 hover:shadow-xl shrink-0 h-12 rounded-xl px-6 transition-all duration-300 font-bold"
                                >
                                    Book a New Service
                                    <Plus className="w-4 h-4 ml-2" />
                                </Button>
                            </div>

                            {/* Analytics Quick Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
                                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                        Total Care Booked
                                        <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                                    </div>
                                    <h2 className="text-3xl font-black mt-4">{totalBookingsCount}</h2>
                                    <p className="text-[10px] text-slate-400 mt-1">Visits requested overall</p>
                                </div>
                                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
                                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                        Active Shifts
                                        <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                                    </div>
                                    <h2 className="text-3xl font-black text-emerald-600 mt-4">{activeBookingsCount}</h2>
                                    <p className="text-[10px] text-slate-400 mt-1">Ongoing or upcoming schedules</p>
                                </div>
                                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
                                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                        Completed Visits
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                    </div>
                                    <h2 className="text-3xl font-black text-blue-600 mt-4">{completedBookingsCount}</h2>
                                    <p className="text-[10px] text-slate-400 mt-1">Successfully served visits</p>
                                </div>
                                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
                                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                        Cancelled Visits
                                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                    </div>
                                    <h2 className="text-3xl font-black text-rose-600 mt-4">{cancelledBookingsCount}</h2>
                                    <p className="text-[10px] text-slate-400 mt-1">Cancelled by self or portal</p>
                                </div>
                            </div>

                            {/* Ongoing / Highlight Booking Spotlight */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-slate-800">Spotlight Care Activity</h3>
                                        <button 
                                            onClick={() => {
                                                setActiveTab('bookings')
                                                setBookingFilter('active')
                                            }}
                                            className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                                        >
                                            View all active
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {bookingsLoading ? (
                                        <div className="h-48 bg-white animate-pulse rounded-2xl border border-slate-100"></div>
                                    ) : bookingsData?.result?.length === 0 ? (
                                        <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-500 space-y-4">
                                            <Heart className="w-12 h-12 text-primary/20 mx-auto" />
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-slate-700">No current care visit requests</h4>
                                                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                                    You don't have any pending or assigned shifts scheduled at the moment.
                                                </p>
                                            </div>
                                            <Button 
                                                variant="outline"
                                                onClick={() => navigate('/services')}
                                                className="border-primary/20 text-primary hover:bg-primary/5 rounded-xl text-xs font-bold"
                                            >
                                                Book a Service Now
                                            </Button>
                                        </div>
                                    ) : (
                                        // Spotlight card
                                        (() => {
                                            const spotlightBooking = bookingsData.result.find(b => 
                                                ['pending', 'nurse_assigned', 'nurse_accepted', 'on_route', 'in_progress'].includes(b.status)
                                            ) || bookingsData.result[0]

                                            return (
                                                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                                                    <div className="p-6 space-y-4">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div>
                                                                <span className="text-[10px] font-mono font-extrabold text-primary/80 bg-primary/5 px-2.5 py-1 rounded-md">
                                                                    {spotlightBooking.bookingNumber}
                                                                </span>
                                                                <h4 className="font-black text-xl text-slate-800 mt-2">
                                                                    {spotlightBooking.serviceId?.name || 'Home Nursing visit'}
                                                                </h4>
                                                            </div>
                                                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusColor(spotlightBooking.status)}`}>
                                                                {spotlightBooking.status.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2 text-sm">
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Date</span>
                                                                <p className="font-semibold text-slate-700">
                                                                    {new Date(spotlightBooking.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Timeslot</span>
                                                                <p className="font-semibold text-slate-700 truncate">{spotlightBooking.timeSlot}</p>
                                                            </div>
                                                            <div className="space-y-1 col-span-2 md:col-span-1">
                                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Patient Info</span>
                                                                <p className="font-semibold text-slate-700 truncate">
                                                                    {spotlightBooking.patientDetails?.name} ({spotlightBooking.patientDetails?.gender})
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Nurse details */}
                                                        <div className="pt-4 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            {spotlightBooking.assignedNurseId ? (
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-800 text-sm shrink-0">
                                                                        {spotlightBooking.assignedNurseId.name[0]}
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Assigned Caregiver</span>
                                                                        <h5 className="font-bold text-sm text-slate-800 leading-tight">{spotlightBooking.assignedNurseId.name}</h5>
                                                                        <p className="text-xs text-slate-500">{spotlightBooking.assignedNurseId.mobile}</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-xs text-slate-500 italic bg-amber-50/50 px-3 py-2 rounded-xl">
                                                                    <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                                                                    Awaiting immediate nurse assignment by manager...
                                                                </div>
                                                            )}

                                                            <div className="flex gap-2 justify-end self-end sm:self-center">
                                                                {spotlightBooking.paymentStatus === 'pending' && spotlightBooking.paymentMode === 'online' && spotlightBooking.status !== 'cancelled' && (
                                                                    <Button 
                                                                        size="sm"
                                                                        onClick={() => handlePayNow(spotlightBooking)}
                                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-lg"
                                                                    >
                                                                        Pay ₹{spotlightBooking.totalAmount}
                                                                    </Button>
                                                                )}
                                                                {['pending', 'nurse_assigned'].includes(spotlightBooking.status) && (
                                                                    <Button 
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setBookingToCancel(spotlightBooking._id)
                                                                            setIsCancelOpen(true)
                                                                        }}
                                                                        className="border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 h-9 rounded-lg"
                                                                    >
                                                                        Cancel Shift
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })()
                                    )}
                                </div>

                                {/* Sidebar Column Quick links */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800">Quick Profile Actions</h3>
                                    <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                                        <button 
                                            onClick={() => setActiveTab('profile')}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-50 transition-all text-left"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="p-2 rounded-lg bg-primary/5 text-primary">
                                                    <Camera className="w-4 h-4" />
                                                </span>
                                                <span>
                                                    <h5 className="font-bold text-sm">Update Profile Avatar</h5>
                                                    <p className="text-[10px] text-muted-foreground">Upload your latest portrait</p>
                                                </span>
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('profile')}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-50 transition-all text-left"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="p-2 rounded-lg bg-teal-500/5 text-teal-600">
                                                    <User className="w-4 h-4" />
                                                </span>
                                                <span>
                                                    <h5 className="font-bold text-sm">Modify Contact Details</h5>
                                                    <p className="text-[10px] text-muted-foreground">Change name & phone number</p>
                                                </span>
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                                        </button>

                                        <button 
                                            onClick={() => setActiveTab('profile')}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-50 transition-all text-left"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="p-2 rounded-lg bg-amber-500/5 text-amber-600">
                                                    <Lock className="w-4 h-4" />
                                                </span>
                                                <span>
                                                    <h5 className="font-bold text-sm">Change Credentials</h5>
                                                    <p className="text-[10px] text-muted-foreground">Update account password</p>
                                                </span>
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                                        </button>

                                        <button 
                                            onClick={() => {
                                                setActiveTab('bookings')
                                                setBookingFilter('cancelled')
                                            }}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-50 transition-all text-left"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="p-2 rounded-lg bg-rose-500/5 text-rose-600">
                                                    <XCircle className="w-4 h-4" />
                                                </span>
                                                <span>
                                                    <h5 className="font-bold text-sm">Cancelled Vault</h5>
                                                    <p className="text-[10px] text-muted-foreground">Check your cancelled visits</p>
                                                </span>
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. My Bookings Tab Content */}
                    {activeTab === 'bookings' && (
                        <motion.div
                            key="bookings"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-8"
                        >
                            {/* Page Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Your Care Vault</h1>
                                    <p className="text-sm text-slate-500 mt-1">Review active clinical shifts, historical completed records, and cancellations.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={refetchBookings}
                                    className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-10 px-4 self-start sm:self-center shrink-0 flex items-center gap-2 font-bold text-xs"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Reload Vault
                                </Button>
                            </div>

                            {/* Sub Filters Header Menu */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl shrink-0 self-start">
                                    {['all', 'active', 'completed', 'cancelled'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setBookingFilter(filter)}
                                            className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${
                                                bookingFilter === filter
                                                    ? 'bg-white text-slate-800 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            {filter === 'active' ? 'Active & In-Progress' : filter}
                                        </button>
                                    ))}
                                </div>

                                {/* Text search input */}
                                <div className="relative max-w-sm w-full">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0" />
                                    <Input
                                        placeholder="Search by ID, name, or service..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-10 border-slate-200 focus-visible:ring-primary rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            {/* Main Bookings List Grid */}
                            {bookingsLoading ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-52 bg-white animate-pulse rounded-2xl border border-slate-100"></div>
                                    ))}
                                </div>
                            ) : filteredBookings.length === 0 ? (
                                <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-100 max-w-md mx-auto space-y-4">
                                    <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg text-slate-700">No matches found</h3>
                                        <p className="text-xs text-muted-foreground">
                                            We couldn't find any visit schedules matching your current filter or search criteria.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            setBookingFilter('all')
                                            setSearchTerm('')
                                        }}
                                        variant="outline"
                                        className="border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold"
                                    >
                                        Reset Search Filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredBookings.map((booking) => (
                                        <div
                                            key={booking._id}
                                            className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                                        >
                                            <div className="p-6 flex-1 space-y-4">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <span className="text-[10px] font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-sm">
                                                            {booking.bookingNumber}
                                                        </span>
                                                        <h3 className="font-extrabold text-lg text-slate-800 leading-snug mt-1.5">
                                                            {booking.serviceId?.name || 'Home Clinical visit'}
                                                        </h3>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase shrink-0 ${getStatusColor(booking.status)}`}>
                                                        {booking.status.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                {/* Address & Scheduling info details */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/50 p-3.5 rounded-xl border border-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                                        <span>{new Date(booking.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                                        <span className="truncate">{booking.timeSlot}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 sm:col-span-2">
                                                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                                        <span className="line-clamp-2">
                                                            {booking.serviceAddress?.street}, {booking.serviceAddress?.city}, {booking.serviceAddress?.state} - {booking.serviceAddress?.pin}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Patient Details & Instructions */}
                                                <div className="space-y-1.5 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Patient:</span>
                                                        <span className="font-bold text-slate-700">{booking.patientDetails?.name} ({booking.patientDetails?.age} Yrs, {booking.patientDetails?.gender})</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Contact Number:</span>
                                                        <span className="font-semibold text-slate-700">{booking.patientDetails?.mobile}</span>
                                                    </div>
                                                    {booking.customerNote && (
                                                        <div className="bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg text-slate-600 italic">
                                                            <span className="font-semibold not-italic block text-[10px] text-amber-700 uppercase tracking-wide mb-0.5">Special Instructions:</span>
                                                            "{booking.customerNote}"
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Assigned Nurse block */}
                                                <div className="pt-3 border-t border-slate-50">
                                                    {booking.assignedNurseId ? (
                                                        <div className="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-800 text-xs shrink-0">
                                                                {booking.assignedNurseId.name[0]}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Assigned Nurse</span>
                                                                <h4 className="text-xs font-extrabold text-slate-800 truncate leading-none">{booking.assignedNurseId.name}</h4>
                                                                <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{booking.assignedNurseId.mobile}</p>
                                                            </div>
                                                        </div>
                                                    ) : booking.status === 'cancelled' ? (
                                                        <div className="text-center p-2 text-xs text-rose-500 font-semibold bg-rose-50/20 rounded-lg">
                                                            Schedule cancelled successfully.
                                                        </div>
                                                    ) : (
                                                        <div className="text-center p-2.5 text-xs text-slate-500 italic bg-amber-50/30 rounded-lg border border-amber-500/5">
                                                            Awaiting nurse configuration by portal manager...
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pricing & Footer Actions */}
                                            <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex justify-between items-center gap-4 shrink-0">
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Session Fee</span>
                                                    <span className="text-lg font-black text-slate-800">₹{booking.totalAmount}</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    {booking.paymentStatus === 'pending' && booking.paymentMode === 'online' && booking.status !== 'cancelled' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handlePayNow(booking)}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-lg px-4 text-xs"
                                                        >
                                                            Pay Online
                                                        </Button>
                                                    )}
                                                    {booking.paymentStatus === 'paid' && (
                                                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wide">
                                                            <Check className="w-3.5 h-3.5" /> Paid Securely
                                                        </span>
                                                    )}
                                                    {['pending', 'nurse_assigned'].includes(booking.status) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setBookingToCancel(booking._id)
                                                                setIsCancelOpen(true)
                                                            }}
                                                            className="border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 h-9 rounded-lg px-3 text-xs"
                                                        >
                                                            Cancel Visit
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 3. My Profile Tab Content */}
                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-8"
                        >
                            {/* Page Header */}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Profile Details & Safety</h1>
                                <p className="text-sm text-slate-500 mt-1">Manage your home care identity settings, secure password logins, and custom photo avatars.</p>
                            </div>

                            {profileLoading ? (
                                <div className="h-96 bg-white animate-pulse rounded-3xl border border-slate-100"></div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                    {/* Left Column: Avatar Picture Uploader */}
                                    <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col items-center text-center shadow-xs">
                                        <div className="relative group mb-6">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg bg-slate-100 flex items-center justify-center relative">
                                                {avatarPreviewUrl ? (
                                                    <img 
                                                        src={avatarPreviewUrl} 
                                                        alt="Local Preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : liveProfile?.profilePhoto ? (
                                                    <img 
                                                        src={liveProfile.profilePhoto} 
                                                        alt="Server Avatar" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-16 h-16 text-slate-300" />
                                                )}
                                            </div>
                                            
                                            {/* Hover Photo Changer Overlay */}
                                            <label 
                                                htmlFor="avatar-uploader" 
                                                className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300"
                                            >
                                                <Camera className="w-5 h-5" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                                            </label>
                                            <input 
                                                id="avatar-uploader"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarFileChange}
                                                ref={fileInputRef}
                                            />
                                        </div>

                                        <h4 className="font-extrabold text-lg text-slate-800 leading-tight">{liveProfile?.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Joined CareNest: {new Date(liveProfile?.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>

                                        {selectedAvatarFile && (
                                            <div className="mt-4 w-full space-y-2">
                                                <p className="text-[10px] text-amber-600 font-semibold bg-amber-50 p-2 rounded-lg leading-normal">
                                                    New avatar selected! Make sure to hit "Save Profile" below to sync with the database.
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedAvatarFile(null)
                                                        setAvatarPreviewUrl('')
                                                        if (fileInputRef.current) fileInputRef.current.value = ''
                                                    }}
                                                    className="text-slate-500 hover:text-slate-800 text-xs font-bold"
                                                >
                                                    Cancel Preview
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Columns: Forms for profile details and security */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Card Form 1: Details */}
                                        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
                                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                                                <UserCheck className="w-5 h-5 text-primary shrink-0" />
                                                Basic Information
                                            </h3>

                                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</Label>
                                                        <Input
                                                            required
                                                            placeholder="Full name"
                                                            value={profileForm.name}
                                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-primary rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mobile Number</Label>
                                                        <Input
                                                            required
                                                            placeholder="10-digit mobile"
                                                            value={profileForm.mobile}
                                                            onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-primary rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                            Email Address
                                                            <Lock className="w-3 h-3 text-slate-400" />
                                                        </Label>
                                                        <Input
                                                            disabled
                                                            value={liveProfile?.email || ''}
                                                            className="h-11 border-slate-100 bg-slate-50/50 text-slate-500 cursor-not-allowed rounded-xl text-sm"
                                                        />
                                                        <span className="text-[10px] text-slate-400 block leading-normal pt-1">
                                                            Email addresses are permanently locked for account integrity and verified clinical scheduling. Contact customer support to request email alterations.
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-slate-50">
                                                    <Button
                                                        type="submit"
                                                        disabled={profileUpdating}
                                                        className="bg-primary hover:bg-primary/95 text-white font-bold h-11 px-6 rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-lg"
                                                    >
                                                        {profileUpdating ? 'Saving Profile Details...' : 'Save Profile Changes'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>

                                        {/* Card Form 2: Password changer security */}
                                        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
                                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                                                <Key className="w-5 h-5 text-amber-500 shrink-0" />
                                                Account Security
                                            </h3>

                                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                                <div className="space-y-4">
                                                    {/* Current Pass */}
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Account Password</Label>
                                                        <div className="relative">
                                                            <Input
                                                                required
                                                                type={showCurrentPass ? 'text' : 'password'}
                                                                placeholder="Enter current password"
                                                                value={passwordForm.currentPassword}
                                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                                className="h-11 border-slate-200 focus-visible:ring-primary rounded-xl text-sm pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 shrink-0"
                                                            >
                                                                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* New Pass */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    required
                                                                    type={showNewPass ? 'text' : 'password'}
                                                                    placeholder="Minimum 8 characters"
                                                                    value={passwordForm.newPassword}
                                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                                    className="h-11 border-slate-200 focus-visible:ring-primary rounded-xl text-sm pr-10"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowNewPass(!showNewPass)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 shrink-0"
                                                                >
                                                                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    required
                                                                    type={showConfirmPass ? 'text' : 'password'}
                                                                    placeholder="Re-enter new password"
                                                                    value={passwordForm.confirmPassword}
                                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                                    className="h-11 border-slate-200 focus-visible:ring-primary rounded-xl text-sm pr-10"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 shrink-0"
                                                                >
                                                                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Strength helper alert box */}
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                                                        <span className="font-bold text-slate-700 block uppercase tracking-wider mb-1">Password Strength Checklist:</span>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${passwordForm.newPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Minimum 8 characters length
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 uppercase letter
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 lowercase letter
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 number digit
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 symbol / special character
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-slate-50">
                                                    <Button
                                                        type="submit"
                                                        disabled={passwordUpdating}
                                                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold h-11 px-6 rounded-xl transition-all shadow-md"
                                                    >
                                                        {passwordUpdating ? 'Updating password credentials...' : 'Update Password'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 4. Platform Feedback Tab Content */}
                    {activeTab === 'feedback' && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-8"
                        >
                            {/* Page Header */}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Platform Feedback & Reviews</h1>
                                <p className="text-sm text-slate-500 mt-1">We value your opinion! Share your experience with CareNest to help us improve doorstep care.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Form Column */}
                                <div className="lg:col-span-2 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-xs">
                                    <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-slate-700">How would you rate your experience?</Label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((starValue) => {
                                                    const isFilled = starValue <= feedbackForm.rating
                                                    return (
                                                        <button
                                                            key={starValue}
                                                            type="button"
                                                            onClick={() => setFeedbackForm({ ...feedbackForm, rating: starValue })}
                                                            className="transition-transform duration-200 hover:scale-110 focus:outline-hidden"
                                                        >
                                                            <Star
                                                                className={`w-8 h-8 ${
                                                                    isFilled 
                                                                        ? 'fill-amber-400 text-amber-400' 
                                                                        : 'fill-slate-100 text-slate-300'
                                                                }`}
                                                            />
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">Click on a star to set your rating.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-slate-700">Your Review / Comments</Label>
                                            <textarea
                                                required
                                                rows="5"
                                                value={feedbackForm.comment}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                                                placeholder="Write your detailed experience here. Your feedback will help patients and the platform improve..."
                                                className="w-full rounded-xl border border-slate-200 bg-transparent px-3.5 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-slate-50">
                                            <Button
                                                type="submit"
                                                disabled={feedbackSubmitting}
                                                className="bg-primary hover:bg-primary/95 text-white font-bold h-11 px-8 rounded-xl transition-all shadow-md shadow-primary/15"
                                            >
                                                {feedbackSubmitting ? 'Submitting your review...' : 'Submit Platform Review'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>

                                {/* Guidelines Column */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800">Feedback Guidelines</h3>
                                    <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-6 space-y-4">
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-sm text-purple-950">Vetted Platform Reviews</h5>
                                            <p className="text-xs text-purple-900 leading-normal">
                                                All patient feedbacks are reviewed by the administration. Approved testimonials will appear directly on our public homepage marquee carousel.
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-sm text-purple-950">Helpful Details</h5>
                                            <p className="text-xs text-purple-900 leading-normal">
                                                Please describe the behavior, responsiveness, and clinical capability of the caregivers or the seamlessness of the booking portal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 4. Booking Wizard Drawer Modal */}
            <AnimatePresence>
                {isBookingOpen && selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                            onClick={() => setIsBookingOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-purple-50"
                        >
                            <div className="sticky top-0 bg-white border-b border-purple-50 px-6 py-4 flex justify-between items-center z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Book Doorstep Visit</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{selectedService.name} • ₹{selectedService.price}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsBookingOpen(false)}
                                    className="rounded-full hover:bg-slate-100"
                                >
                                    <XCircle className="w-6 h-6 text-slate-400" />
                                </Button>
                            </div>

                            <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
                                {/* Service Info Summary card */}
                                <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl flex items-center gap-3">
                                    <Heart className="w-5 h-5 text-primary fill-primary/10 flex-shrink-0" />
                                    <div className="text-xs text-purple-900 leading-normal">
                                        By booking, you register a request with our dashboard. We will dispatch the closest verified nurse matching the service qualifications (ANM, GNM, B.Sc) and your preferences.
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-2 border-primary pl-2">Patient Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Patient Name</Label>
                                            <Input
                                                required
                                                value={bookingFormData.patientName}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, patientName: e.target.value })}
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Contact Number</Label>
                                            <Input
                                                required
                                                value={bookingFormData.patientMobile}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, patientMobile: e.target.value })}
                                                placeholder="10-digit mobile"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Age</Label>
                                            <Input
                                                required
                                                type="number"
                                                value={bookingFormData.patientAge}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, patientAge: e.target.value })}
                                                placeholder="Years"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Patient Gender</Label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                                value={bookingFormData.patientGender}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, patientGender: e.target.value })}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-2 border-primary pl-2">Visit Address & Schedule</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label>Street Address</Label>
                                            <Input
                                                required
                                                value={bookingFormData.street}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, street: e.target.value })}
                                                placeholder="House/Flat No., Road, Landmark"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>City</Label>
                                            <Input
                                                required
                                                value={bookingFormData.city}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, city: e.target.value })}
                                                placeholder="e.g. Pune"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>State</Label>
                                            <Input
                                                required
                                                value={bookingFormData.state}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, state: e.target.value })}
                                                placeholder="e.g. Maharashtra"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Pincode</Label>
                                            <Input
                                                required
                                                value={bookingFormData.pin}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, pin: e.target.value })}
                                                placeholder="6-digit pin"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Preferred Date</Label>
                                            <Input
                                                required
                                                type="date"
                                                value={bookingFormData.preferredDate}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, preferredDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label>Preferred Time Slot</Label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm focus-visible:outline-hidden"
                                                value={bookingFormData.timeSlot}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, timeSlot: e.target.value })}
                                            >
                                                <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                                                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                                                <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                                                <option value="Night Duty (8 PM - 8 AM)">Night Duty (8 PM - 8 AM)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-2 border-primary pl-2">Caregiver & Billing Preferences</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Nurse Gender Preference</Label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm focus-visible:outline-hidden"
                                                value={bookingFormData.nurseGenderPreference}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, nurseGenderPreference: e.target.value })}
                                            >
                                                <option value="any">Any (Recommended)</option>
                                                <option value="female">Female only</option>
                                                <option value="male">Male only</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Payment Method</Label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm focus-visible:outline-hidden"
                                                value={bookingFormData.paymentMode}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, paymentMode: e.target.value })}
                                            >
                                                <option value="online">Online Payment (Razorpay)</option>
                                                <option value="cash">Pay with Cash on Visit</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label>Special Instructions (Optional)</Label>
                                            <textarea
                                                className="w-full min-h-[80px] p-3 rounded-md border border-input bg-white text-sm focus-visible:outline-hidden"
                                                placeholder="Provide clinical details, diagnostic requests, or landmarks here..."
                                                value={bookingFormData.customerNote}
                                                onChange={(e) => setBookingFormData({ ...bookingFormData, customerNote: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="sticky bottom-0 bg-white pt-4 border-t border-purple-50 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsBookingOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={bookingCreating}
                                        className="bg-primary hover:bg-primary/95 text-white font-bold"
                                    >
                                        {bookingCreating ? 'Booking Shift...' : `Submit Booking • ₹${selectedService.price}`}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 5. Cancellation Confirmation Drawer */}
            <AnimatePresence>
                {isCancelOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                            onClick={() => setIsCancelOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full relative z-10 border border-rose-50"
                        >
                            <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-rose-600" />
                                Cancel visit schedule?
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Cancelling will instantly release your assigned nurse. Please provide a reason to help us maintain service quality.
                            </p>

                            <form onSubmit={handleCancelRequest} className="mt-4 space-y-4">
                                <div className="space-y-1">
                                    <Label>Reason for cancellation</Label>
                                    <textarea
                                        required
                                        className="w-full min-h-[80px] p-3 rounded-md border border-input text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                                        placeholder="e.g. Booking a different time slot, clinical change, emergency..."
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 border-t pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCancelOpen(false)}
                                    >
                                        Keep Booking
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                                    >
                                        Confirm Cancellation
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 6. Premium Simulated Razorpay Payment Desk */}
            <AnimatePresence>
                {paymentSimulationBooking && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl max-w-md w-full relative z-10 border border-slate-800"
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-extrabold tracking-tight">CareNest Secure Checkout</h3>
                                <p className="text-xs text-slate-400 mt-1">Razorpay Sandbox Simulator</p>
                            </div>

                            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl my-6 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Order ID:</span>
                                    <span className="font-mono text-slate-200">{paymentSimulationBooking.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Amount Due:</span>
                                    <span className="font-extrabold text-blue-400">₹{paymentSimulationBooking.amount}</span>
                                </div>
                                <div className="flex justify-between text-xs pt-2 border-t border-slate-700">
                                    <span className="text-slate-400">Security:</span>
                                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> 256-bit AES SSL Encrypted
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => completePaymentVerification(true)}
                                    className="w-full bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold h-11"
                                >
                                    Simulate Success Payment
                                </Button>
                                <Button
                                    onClick={() => completePaymentVerification(false)}
                                    variant="outline"
                                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    Simulate Payment Failure / Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default PatientDashboard

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    Heart, Stethoscope, ShieldCheck, ShieldAlert, Award, Clock, MapPin,
    Calendar, Check, X, User, Phone, CheckCircle2, ChevronRight,
    DollarSign, Briefcase, FileText, Upload, RefreshCw, LogOut, Loader2,
    Star, Grid, Lock, Key, Camera, Mail, Eye, EyeOff, UserCheck, MessageSquare,
    Search
} from 'lucide-react'
import { logoutNurse } from '@/redux/slice/authSlice'
import { useLogoutNurseMutation } from '@/redux/apis/authApi'
import {
    useGetNurseInfoQuery,
    useCreateNurseInfoMutation,
    useUpdateNurseInfoMutation,
    useUpdateAvailabilityMutation,
    useGetNurseBookingsQuery,
    useAcceptBookingMutation,
    useDeclineBookingMutation,
    useUpdateBookingStatusMutation,
    useUpdateNursePasswordMutation,
    useGetNurseReviewsQuery
} from '@/redux/apis/nurseApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const NurseDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nurse = useSelector(state => state.auth.nurse)

    useEffect(() => {
        if (!nurse) {
            navigate('/nurse/login')
        }
    }, [nurse, navigate])

    const [logoutNurseMutation] = useLogoutNurseMutation()

    // RTK Queries & Mutations
    const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useGetNurseInfoQuery()
    const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useGetNurseBookingsQuery()
    const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useGetNurseReviewsQuery(nurse?._id, { skip: !nurse?._id })

    const [createNurseInfo, { isLoading: creatingProfile }] = useCreateNurseInfoMutation()
    const [updateNurseInfo, { isLoading: updatingProfile }] = useUpdateNurseInfoMutation()
    const [updateAvailability] = useUpdateAvailabilityMutation()
    const [acceptBooking] = useAcceptBookingMutation()
    const [declineBooking] = useDeclineBookingMutation()
    const [updateBookingStatus] = useUpdateBookingStatusMutation()
    const [updateNursePassword, { isLoading: passwordUpdating }] = useUpdateNursePasswordMutation()

    // Console Navigation State
    const [activeTab, setActiveTab] = useState('dashboard') // dashboard, duties, reviews, profile
    const [dutiesFilter, setDutiesFilter] = useState('all') // all, assigned, active, completed, cancelled
    const [searchTerm, setSearchTerm] = useState('')

    // Modals & Reason Toggles
    const [declineBookingId, setDeclineBookingId] = useState(null)
    const [declineReason, setDeclineReason] = useState('')
    const [isSubmittingKYC, setIsSubmittingKYC] = useState(false)

    // Form inputs for KYC / Profile update Wizard
    const [kycForm, setKycForm] = useState({
        name: '',
        mobile: '',
        gender: 'Female',
        street: '',
        city: '',
        state: '',
        pin: '',
        qualification: 'GNM',
        experienceYear: '1',
        nursingCouncilRegNo: '',
        specialization: 'General Nursing',
        accountNumber: '',
        ifscCode: '',
        bankName: ''
    })

    // Files state for KYC / Photo uploads
    const [files, setFiles] = useState({
        profilePhoto: null,
        degreeCertificate: null,
        nursingCouncilCertificate: null,
        idProof: null,
        addressProof: null
    })
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')
    const avatarInputRef = useRef(null)

    // Password Changer state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showCurrentPass, setShowCurrentPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    // Sync live profile information
    const liveProfile = profileData?.result
    const liveAuth = profileData?.auth || nurse

    useEffect(() => {
        if (liveProfile) {
            setKycForm({
                name: liveAuth?.name || '',
                mobile: liveAuth?.mobile || '',
                gender: liveProfile.gender || 'Female',
                street: liveProfile.address?.street || '',
                city: liveProfile.address?.city || '',
                state: liveProfile.address?.state || '',
                pin: liveProfile.address?.pin || '',
                qualification: liveProfile.qualification || 'GNM',
                experienceYear: String(liveProfile.experienceYear || '1'),
                nursingCouncilRegNo: liveProfile.nursingCouncilRegNo || '',
                specialization: liveProfile.specialization || 'General Nursing',
                accountNumber: liveProfile.bankDetailes?.accountNumber || '',
                ifscCode: liveProfile.bankDetailes?.ifscCode || '',
                bankName: liveProfile.bankDetailes?.bankName || ''
            })
        } else if (nurse) {
            setKycForm(prev => ({
                ...prev,
                name: nurse.name || '',
                mobile: nurse.mobile || ''
            }))
        }
    }, [profileData, nurse])

    const handleLogout = async () => {
        try {
            await logoutNurseMutation().unwrap()
            dispatch(logoutNurse())
            toast.success('Logged out successfully')
            navigate('/')
        } catch (error) {
            toast.error('Logout failed')
        }
    }

    const handleFileChange = (e, fileType) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFiles(prev => ({
                ...prev,
                [fileType]: file
            }))

            if (fileType === 'profilePhoto') {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setAvatarPreviewUrl(reader.result)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const handleKycSubmit = async (e) => {
        e.preventDefault()

        // Document checks for first-time KYC submission
        if (!liveProfile && (!files.degreeCertificate || !files.nursingCouncilCertificate || !files.idProof || !files.addressProof)) {
            toast.error('Please upload all required certificates & identity documents!')
            return
        }

        try {
            setIsSubmittingKYC(true)
            const formData = new FormData()
            formData.append('name', kycForm.name.trim())
            formData.append('mobile', kycForm.mobile.trim())
            formData.append('gender', kycForm.gender)
            formData.append('qualification', kycForm.qualification)
            formData.append('experienceYear', Number(kycForm.experienceYear))
            formData.append('nursingCouncilRegNo', kycForm.nursingCouncilRegNo)
            formData.append('specialization', kycForm.specialization)

            // Address object structure serialization
            formData.append('address[street]', kycForm.street)
            formData.append('address[city]', kycForm.city)
            formData.append('address[state]', kycForm.state)
            formData.append('address[pin]', kycForm.pin)

            // Bank details
            formData.append('bankDetailes[accountNumber]', kycForm.accountNumber)
            formData.append('bankDetailes[ifscCode]', kycForm.ifscCode)
            formData.append('bankDetailes[bankName]', kycForm.bankName)

            // Append files
            if (files.profilePhoto) formData.append('profilePhoto', files.profilePhoto)
            if (files.degreeCertificate) formData.append('degreeCertificate', files.degreeCertificate)
            if (files.nursingCouncilCertificate) formData.append('nursingCouncilCertificate', files.nursingCouncilCertificate)
            if (files.idProof) formData.append('idProof', files.idProof)
            if (files.addressProof) formData.append('addressProof', files.addressProof)

            if (liveProfile) {
                await updateNurseInfo(formData).unwrap()
                toast.success('Profile details updated successfully!')
            } else {
                await createNurseInfo(formData).unwrap()
                toast.success('KYC Profile submitted for licensing verification!')
            }
            
            setSelectedAvatarFile(null)
            refetchProfile()
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to submit profile information')
        } finally {
            setIsSubmittingKYC(false)
        }
    }

    const setSelectedAvatarFile = (val) => {
        // Mock method to clean up file list state
        if (val === null) {
            setFiles(prev => ({ ...prev, profilePhoto: null }))
        }
    }

    const handleToggleAvailability = async (status) => {
        try {
            await updateAvailability({ availabilityStatus: status }).unwrap()
            toast.success(`Availability changed to: ${status.replace('_', ' ').toUpperCase()}`)
            refetchProfile()
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to toggle availability')
        }
    }

    const handleAcceptShift = async (bookingId) => {
        try {
            await acceptBooking(bookingId).unwrap()
            toast.success('Visit shift accepted! Drive safely.')
            refetchBookings()
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to accept booking')
        }
    }

    const handleDeclineSubmit = async (e) => {
        e.preventDefault()
        try {
            await declineBooking({
                bookingId: declineBookingId,
                reason: declineReason
            }).unwrap()
            toast.success('Shift declined successfully')
            setDeclineBookingId(null)
            setDeclineReason('')
            refetchBookings()
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to decline')
        }
    }

    const handleStatusTransition = async (bookingId, currentStatus) => {
        let nextStatus = ''
        if (currentStatus === 'nurse_accepted') nextStatus = 'on_route'
        else if (currentStatus === 'on_route') nextStatus = 'in_progress'
        else if (currentStatus === 'in_progress') nextStatus = 'complete'

        if (!nextStatus) return

        try {
            await updateBookingStatus({ bookingId, status: nextStatus }).unwrap()
            toast.success(`Shift status changed to: ${nextStatus.replace('_', ' ').toUpperCase()}`)
            refetchBookings()
            if (nextStatus === 'complete') {
                refetchProfile()
            }
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to transition shift state')
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
            await updateNursePassword({ currentPassword, newPassword }).unwrap()
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

    const getShiftActions = (booking) => {
        switch (booking.status) {
            case 'nurse_assigned':
                return (
                    <div className="flex gap-2 w-full mt-4">
                        <Button
                            onClick={() => handleAcceptShift(booking._id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                            Accept Shift
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setDeclineBookingId(booking._id)}
                            className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                            Decline
                        </Button>
                    </div>
                )
            case 'nurse_accepted':
                return (
                    <Button
                        onClick={() => handleStatusTransition(booking._id, booking.status)}
                        className="w-full mt-4 bg-primary hover:bg-primary/95 text-white font-bold"
                    >
                        Start Route to Patient
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                )
            case 'on_route':
                return (
                    <Button
                        onClick={() => handleStatusTransition(booking._id, booking.status)}
                        className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold"
                    >
                        Arrived at Location
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                )
            case 'in_progress':
                return (
                    <Button
                        onClick={() => handleStatusTransition(booking._id, booking.status)}
                        className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold animate-pulse"
                    >
                        Finish & Mark Complete
                        <CheckCircle2 className="w-4 h-4 ml-1.5" />
                    </Button>
                )
            default:
                return null
        }
    }

    const getVerificationBanner = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4">
                        <ShieldAlert className="w-12 h-12 text-amber-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-amber-900 text-lg">Verification Pending</h3>
                            <p className="text-sm text-amber-800 mt-1">
                                Our medical licensing board is reviewing your submitted credentials (degree certificate and council registry ID). We will verify your credentials within 24 hours.
                            </p>
                        </div>
                    </div>
                )
            case 'reject':
                return (
                    <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4">
                        <ShieldAlert className="w-12 h-12 text-rose-600 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-bold text-rose-900 text-lg">KYC Rejected / Suspended</h3>
                            <p className="text-sm text-rose-800 mt-1">
                                <strong>Feedback:</strong> {liveProfile?.rejectionReason || 'Documents uploaded were unclear. Please resubmit credentials.'}
                            </p>
                        </div>
                    </div>
                )
            case 'approved':
                return (
                    <div className="bg-emerald-50/80 border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-12 h-12 text-emerald-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-emerald-950 text-lg flex items-center gap-2">
                                    CareNest Verified Professional
                                </h3>
                                <p className="text-sm text-emerald-800 mt-0.5">
                                    Licensed Reg No: <strong className="font-mono">{liveProfile?.nursingCouncilRegNo}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Availability Pill selectors */}
                        <div className="flex flex-wrap gap-2">
                            {['available', 'busy', 'off_duty'].map((state) => (
                                <button
                                    key={state}
                                    onClick={() => handleToggleAvailability(state)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-300 border ${liveProfile?.availabilityStatus === state
                                        ? state === 'available'
                                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                                            : state === 'busy'
                                                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                                                : 'bg-slate-500 text-white border-slate-600 shadow-md'
                                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                                        }`}
                                >
                                    {state.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            default:
                return null
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

    // Filtered duties selector
    const filteredDuties = bookingsData?.result?.filter(booking => {
        // Text search match
        const matchesSearch = 
            booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.serviceId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.patientDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())

        // Tab Filter match
        let matchesTab = true
        if (dutiesFilter === 'assigned') {
            matchesTab = booking.status === 'nurse_assigned'
        } else if (dutiesFilter === 'active') {
            matchesTab = ['nurse_accepted', 'on_route', 'in_progress'].includes(booking.status)
        } else if (dutiesFilter === 'completed') {
            matchesTab = booking.status === 'complete'
        } else if (dutiesFilter === 'cancelled') {
            matchesTab = booking.status === 'cancelled'
        }

        return matchesSearch && matchesTab
    }) || []

    const activeDutiesCount = bookingsData?.result?.filter(b => 
        ['nurse_assigned', 'nurse_accepted', 'on_route', 'in_progress'].includes(b.status)
    ).length || 0

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                    <p className="text-sm text-slate-500 font-semibold">Loading clinical console...</p>
                </div>
            </div>
        )
    }

    const isMinLength = passwordForm.newPassword.length >= 8
    const hasUppercase = /[A-Z]/.test(passwordForm.newPassword)
    const hasLowercase = /[a-z]/.test(passwordForm.newPassword)
    const hasNumber = /[0-9]/.test(passwordForm.newPassword)
    const hasSpecial = /[^A-Za-z0-9]/.test(passwordForm.newPassword)

    // If KYC profiles are not populated or rejected, show the KYC Wizards
    const showKycForm = !liveProfile || liveProfile?.verificationStatus === 'reject'

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row text-slate-800">
            {/* Elegant Sidebar Panel */}
            <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-6 self-start">
                        <div className="bg-linear-to-br from-teal-500 to-emerald-600 p-1.5 rounded-lg shadow-sm">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                            CareNest Provider
                        </span>
                    </div>

                    {/* Profile Avatar Widget */}
                    <div className="relative group mb-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-teal-500/20 bg-slate-100 flex items-center justify-center">
                            {avatarPreviewUrl ? (
                                <img src={avatarPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : liveProfile?.profilePhoto ? (
                                <img src={liveProfile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-slate-400" />
                            )}
                        </div>
                        {!showKycForm && (
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className="absolute bottom-0 right-0 bg-teal-600 text-white p-1.5 rounded-full shadow-md hover:bg-teal-700 transition-all"
                                title="Update Profile"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <h3 className="font-extrabold text-base text-slate-800 line-clamp-1">{liveAuth?.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 break-all">{liveAuth?.email}</p>
                    <span className="mt-2.5 px-3 py-1 rounded-full bg-teal-500/5 text-teal-700 text-[10px] uppercase font-bold tracking-wider">
                        {liveProfile?.qualification || 'Clinical Caregiver'}
                    </span>
                </div>

                {/* Sidebar Navigation */}
                {!showKycForm && (
                    <nav className="flex-1 p-4 space-y-1.5">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'dashboard'
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Grid className="w-4 h-4 shrink-0" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('duties')
                                setDutiesFilter('all')
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'duties'
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <Briefcase className="w-4 h-4 shrink-0" />
                                Assigned Work
                            </span>
                            {activeDutiesCount > 0 && (
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                    activeTab === 'duties' ? 'bg-white text-teal-700' : 'bg-teal-600 text-white'
                                }`}>
                                    {activeDutiesCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'reviews'
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4 shrink-0" />
                            Ratings & Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'profile'
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <User className="w-4 h-4 shrink-0" />
                            My Profile
                        </button>
                    </nav>
                )}

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
                {showKycForm ? (
                    /* Verification KYC Form Wizards */
                    <Card className="max-w-3xl mx-auto shadow-xl border-slate-100">
                        <CardHeader className="bg-linear-to-r from-teal-500/10 to-teal-500/5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Award className="w-8 h-8 text-teal-600" />
                                <div>
                                    <CardTitle className="text-2xl font-bold text-slate-800">
                                        Clinical Verification Wizard (KYC)
                                    </CardTitle>
                                    <CardDescription>
                                        Submit your state licensing credentials and certificates to activate your clinical profile.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <form onSubmit={handleKycSubmit} className="p-6 space-y-6">
                            {liveProfile?.verificationStatus === 'reject' && (
                                <div className="bg-rose-50 border border-rose-200 text-xs text-rose-900 rounded-xl p-4 flex gap-2">
                                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold">Prior Submission Rejected:</p>
                                        <p className="mt-0.5">{liveProfile?.rejectionReason}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-2 border-teal-500 pl-2">Personal Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Full Name</Label>
                                        <Input
                                            required
                                            value={kycForm.name}
                                            onChange={(e) => setKycForm({ ...kycForm, name: e.target.value })}
                                            placeholder="Enter registered name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Mobile Number</Label>
                                        <Input
                                            required
                                            value={kycForm.mobile}
                                            onChange={(e) => setKycForm({ ...kycForm, mobile: e.target.value })}
                                            placeholder="10-digit number"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Council Registration No (Licence ID)</Label>
                                        <Input
                                            required
                                            value={kycForm.nursingCouncilRegNo}
                                            onChange={(e) => setKycForm({ ...kycForm, nursingCouncilRegNo: e.target.value })}
                                            placeholder="e.g. MNC-123456"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label>Qualification</Label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                                                value={kycForm.qualification}
                                                onChange={(e) => setKycForm({ ...kycForm, qualification: e.target.value })}
                                            >
                                                <option value="ANM">ANM</option>
                                                <option value="GNM">GNM</option>
                                                <option value="B.Sc Nursing">B.Sc Nursing</option>
                                                <option value="B.Sc">B.Sc</option>
                                                <option value="M.Sc Nursing">M.Sc Nursing</option>
                                                <option value="M.Sc">M.Sc</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Experience (Years)</Label>
                                            <Input
                                                required
                                                type="number"
                                                value={kycForm.experienceYear}
                                                onChange={(e) => setKycForm({ ...kycForm, experienceYear: e.target.value })}
                                                placeholder="e.g. 5"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Clinical Specialization</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                                            value={kycForm.specialization}
                                            onChange={(e) => setKycForm({ ...kycForm, specialization: e.target.value })}
                                        >
                                            <option value="General Nursing">General Nursing</option>
                                            <option value="Post-Surgery Care">Post-Surgery Care</option>
                                            <option value="Elder Care">Elder Care</option>
                                            <option value="Home ICU Care">Home ICU Care</option>
                                            <option value="Injection / IV Administration">Injection / IV Administration</option>
                                            <option value="Dressing Change">Dressing Change</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Gender</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                                            value={kycForm.gender}
                                            onChange={(e) => setKycForm({ ...kycForm, gender: e.target.value })}
                                        >
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-2 border-teal-500 pl-2">Permanent Address</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1 sm:col-span-2">
                                        <Label>Street Address</Label>
                                        <Input
                                            required
                                            value={kycForm.street}
                                            onChange={(e) => setKycForm({ ...kycForm, street: e.target.value })}
                                            placeholder="House No., Street Name, Landmark"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>City</Label>
                                        <Input
                                            required
                                            value={kycForm.city}
                                            onChange={(e) => setKycForm({ ...kycForm, city: e.target.value })}
                                            placeholder="e.g. Pune"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>State</Label>
                                        <Input
                                            required
                                            value={kycForm.state}
                                            onChange={(e) => setKycForm({ ...kycForm, state: e.target.value })}
                                            placeholder="e.g. Maharashtra"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Pincode</Label>
                                        <Input
                                            required
                                            value={kycForm.pin}
                                            onChange={(e) => setKycForm({ ...kycForm, pin: e.target.value })}
                                            placeholder="6-digit pin"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-2 border-teal-500 pl-2">Bank Details (For Payouts)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label>Bank Name</Label>
                                        <Input
                                            required
                                            value={kycForm.bankName}
                                            onChange={(e) => setKycForm({ ...kycForm, bankName: e.target.value })}
                                            placeholder="e.g. HDFC Bank"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Account Number</Label>
                                        <Input
                                            required
                                            value={kycForm.accountNumber}
                                            onChange={(e) => setKycForm({ ...kycForm, accountNumber: e.target.value })}
                                            placeholder="Account No."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>IFSC Code</Label>
                                        <Input
                                            required
                                            value={kycForm.ifscCode}
                                            onChange={(e) => setKycForm({ ...kycForm, ifscCode: e.target.value })}
                                            placeholder="IFSC Code"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-2 border-teal-500 pl-2">Upload Certificates (PDF or Images)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="border border-dashed border-teal-200 p-4 rounded-2xl bg-teal-50/10 hover:bg-teal-50/20 transition-colors">
                                        <Label className="block mb-2 font-bold">Nursing Degree Certificate*</Label>
                                        <input
                                            required={!liveProfile}
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'degreeCertificate')}
                                            className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
                                        />
                                    </div>

                                    <div className="border border-dashed border-teal-200 p-4 rounded-2xl bg-teal-50/10 hover:bg-teal-50/20 transition-colors">
                                        <Label className="block mb-2 font-bold">Nursing Council Reg Certificate*</Label>
                                        <input
                                            required={!liveProfile}
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'nursingCouncilCertificate')}
                                            className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
                                        />
                                    </div>

                                    <div className="border border-dashed border-teal-200 p-4 rounded-2xl bg-teal-50/10 hover:bg-teal-50/20 transition-colors">
                                        <Label className="block mb-2 font-bold">Govt Photo ID Proof (PAN/Aadhaar)*</Label>
                                        <input
                                            required={!liveProfile}
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'idProof')}
                                            className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
                                        />
                                    </div>

                                    <div className="border border-dashed border-teal-200 p-4 rounded-2xl bg-teal-50/10 hover:bg-teal-50/20 transition-colors">
                                        <Label className="block mb-2 font-bold">Address Proof (Light bill/Voter)*</Label>
                                        <input
                                            required={!liveProfile}
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'addressProof')}
                                            className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
                                        />
                                    </div>

                                    <div className="border border-dashed border-teal-200 p-4 rounded-2xl bg-teal-50/10 hover:bg-teal-50/20 transition-colors sm:col-span-2">
                                        <Label className="block mb-2 font-bold">Profile Photo (Optional)</Label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                            className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmittingKYC}
                                className="w-full bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold h-11 rounded-xl shadow-md"
                            >
                                {isSubmittingKYC ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading Documents & Saving Profile...
                                    </div>
                                ) : 'Submit Profile for Licensing Verification'}
                            </Button>
                        </form>
                    </Card>
                ) : (
                    /* Verified Dashboard Main Panel Tab-Switchers */
                    <AnimatePresence mode="wait">
                        {/* A. Console Dashboard Tab */}
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                {getVerificationBanner(liveProfile.verificationStatus)}

                                {/* Analytical Metrics Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <Card className="bg-white shadow-xs border-slate-100 overflow-hidden relative">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Completed Jobs</p>
                                                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{liveProfile.totalCompleteJobs || 0}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                                                    <Briefcase className="w-6 h-6 text-teal-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white shadow-xs border-slate-100 overflow-hidden relative">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">My Platform Share</p>
                                                    <p className="text-3xl font-extrabold text-slate-800 mt-1">₹{(liveProfile.totalCompleteJobs || 0) * 450} (80%)</p>
                                                </div>
                                                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                                                    <DollarSign className="w-6 h-6 text-teal-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-white shadow-xs border-slate-100 overflow-hidden relative">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Clinician Rating</p>
                                                    <p className="text-3xl font-extrabold text-slate-800 mt-1 flex items-center gap-1.5">
                                                        {liveProfile.ratingAverage || '5.0'}
                                                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                                                    <Award className="w-6 h-6 text-teal-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Spotlight Ongoing shift box */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold text-slate-800">Spotlight Duty Activity</h3>
                                            <button 
                                                onClick={() => {
                                                    setActiveTab('duties')
                                                    setDutiesFilter('active')
                                                }}
                                                className="text-xs text-teal-600 hover:underline font-bold flex items-center gap-1"
                                            >
                                                View all active shifts
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {bookingsLoading ? (
                                            <div className="h-48 bg-white animate-pulse rounded-2xl border border-slate-100"></div>
                                        ) : bookingsData?.result?.length === 0 ? (
                                            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-500 space-y-4">
                                                <Heart className="w-12 h-12 text-teal-600/20 mx-auto" />
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-700">No shift schedules dispatched</h4>
                                                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                                        You do not have any pending or assigned shifts at the moment. Toggle your availability status above!
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            // Spotlight card
                                            (() => {
                                                const spotlightShift = bookingsData.result.find(b => 
                                                    ['nurse_assigned', 'nurse_accepted', 'on_route', 'in_progress'].includes(b.status)
                                                ) || bookingsData.result[0]

                                                return (
                                                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                                                        <div className="p-6 space-y-4">
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div>
                                                                    <span className="text-[10px] font-mono font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                                                                        {spotlightShift.bookingNumber}
                                                                    </span>
                                                                    <h4 className="font-black text-xl text-slate-800 mt-2">
                                                                        {spotlightShift.serviceId?.name || 'Home Nursing visit'}
                                                                    </h4>
                                                                </div>
                                                                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusColor(spotlightShift.status)}`}>
                                                                    {spotlightShift.status.replace('_', ' ').toUpperCase()}
                                                                </span>
                                                            </div>

                                                            {/* Exact Address & Details are dynamically passed to nurse */}
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2 text-sm">
                                                                <div className="space-y-1">
                                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Date</span>
                                                                    <p className="font-semibold text-slate-700">
                                                                        {new Date(spotlightShift.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Timeslot</span>
                                                                    <p className="font-semibold text-slate-700 truncate">{spotlightShift.timeSlot}</p>
                                                                </div>
                                                                <div className="space-y-1 col-span-2 md:col-span-1">
                                                                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">Your Earnings</span>
                                                                    <p className="font-extrabold text-emerald-600">
                                                                        ₹{spotlightShift.totalAmount * 0.8} (80% share)
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Patient clinical info */}
                                                            <div className="pt-4 border-t border-slate-50 space-y-2">
                                                                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Patient Details & Address</h5>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                                    <p className="font-semibold text-slate-700 flex items-center gap-2">
                                                                        <User className="w-4 h-4 text-slate-400" />
                                                                        {spotlightShift.patientDetails?.name} ({spotlightShift.patientDetails?.age} Yrs, {spotlightShift.patientDetails?.gender})
                                                                    </p>
                                                                    <p className="font-semibold text-slate-700 flex items-center gap-2">
                                                                        <Phone className="w-4 h-4 text-slate-400" />
                                                                        {spotlightShift.patientDetails?.mobile}
                                                                    </p>
                                                                    <p className="font-semibold text-slate-700 flex items-start gap-2 sm:col-span-2 leading-relaxed">
                                                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                                        {spotlightShift.serviceAddress?.street}, {spotlightShift.serviceAddress?.city}, {spotlightShift.serviceAddress?.state} - {spotlightShift.serviceAddress?.pin}
                                                                    </p>
                                                                </div>

                                                                {spotlightShift.customerNote && (
                                                                    <div className="bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg text-xs italic text-slate-600">
                                                                        <strong>Clinical instruction:</strong> "{spotlightShift.customerNote}"
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="pt-4 border-t border-slate-50 flex justify-end">
                                                                {getShiftActions(spotlightShift)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })()
                                        )}
                                    </div>

                                    {/* Sidebar actions column */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800">Quick Profile Actions</h3>
                                        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
                                            <button 
                                                onClick={() => setActiveTab('profile')}
                                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-50 transition-all text-left"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span className="p-2 rounded-lg bg-teal-500/5 text-teal-600">
                                                        <Camera className="w-4 h-4" />
                                                    </span>
                                                    <span>
                                                        <h5 className="font-bold text-sm">Update Profile Avatar</h5>
                                                        <p className="text-[10px] text-muted-foreground">Upload profile picture</p>
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
                                                        <h5 className="font-bold text-sm">Modify Profile Contact</h5>
                                                        <p className="text-[10px] text-muted-foreground">Edit name, mobile, address</p>
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
                                                        <h5 className="font-bold text-sm">Update Password</h5>
                                                        <p className="text-[10px] text-muted-foreground">Modify security credentials</p>
                                                    </span>
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* B. Assigned Work / Duties Tab */}
                        {activeTab === 'duties' && (
                            <motion.div
                                key="duties"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Your Assigned Work</h1>
                                        <p className="text-sm text-slate-500 mt-1">Review active, completed, or cancelled visit schedules assigned to you.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={refetchBookings}
                                        className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-10 px-4 self-start sm:self-center shrink-0 flex items-center gap-2 font-bold text-xs"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Reload Shifts
                                    </Button>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl shrink-0 self-start">
                                        {['all', 'assigned', 'active', 'completed', 'cancelled'].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setDutiesFilter(filter)}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${
                                                    dutiesFilter === filter
                                                        ? 'bg-teal-600 text-white shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                {filter === 'assigned' ? 'New Dispatched' : filter === 'active' ? 'Ongoing & Route' : filter}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Text search input */}
                                    <div className="relative max-w-sm w-full">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0" />
                                        <Input
                                            placeholder="Search by Patient name or booking ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 h-10 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                        />
                                    </div>
                                </div>

                                {bookingsLoading ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-52 bg-white animate-pulse rounded-2xl border border-slate-100"></div>
                                        ))}
                                    </div>
                                ) : filteredDuties.length === 0 ? (
                                    <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-100 max-w-md mx-auto space-y-4 shadow-xs">
                                        <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg text-slate-700">No shift duties found</h3>
                                            <p className="text-xs text-muted-foreground">
                                                We couldn't find any visit schedules matching your current filter.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {filteredDuties.map((booking) => (
                                            <div
                                                key={booking._id}
                                                className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                                            >
                                                <div className="p-6 space-y-4">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-sm">
                                                                {booking.bookingNumber}
                                                            </span>
                                                            <h3 className="font-extrabold text-lg text-slate-800 leading-snug mt-1.5">
                                                                {booking.serviceId?.name}
                                                            </h3>
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase shrink-0 ${getStatusColor(booking.status)}`}>
                                                            {booking.status.replace('_', ' ')}
                                                        </span>
                                                    </div>

                                                    {/* Full clinical details and address details */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/50 p-3.5 rounded-xl border border-slate-50">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-teal-600" />
                                                            <span>{new Date(booking.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                                                            <span className="truncate">{booking.timeSlot}</span>
                                                        </div>
                                                        <div className="flex items-start gap-2 sm:col-span-2 leading-normal">
                                                            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">
                                                                {booking.serviceAddress?.street}, {booking.serviceAddress?.city}, {booking.serviceAddress?.state} - {booking.serviceAddress?.pinCode}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-400">Patient:</span>
                                                            <span className="font-bold text-slate-700">{booking.patientDetails?.name} ({booking.patientDetails?.age} yr, {booking.patientDetails?.gender})</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-400">Contact Number:</span>
                                                            <span className="font-semibold text-slate-700">{booking.patientDetails?.mobile}</span>
                                                        </div>
                                                        {booking.customerNote && (
                                                            <div className="bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg text-slate-600 italic mt-2">
                                                                <span className="font-semibold not-italic block text-[10px] text-amber-700 uppercase tracking-wide mb-0.5">Clinical Instructions:</span>
                                                                "{booking.customerNote}"
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center gap-4 shrink-0">
                                                    <div>
                                                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Your Share</span>
                                                        <span className="text-base font-extrabold text-emerald-600">₹{booking.totalAmount * 0.8} (80%)</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {getShiftActions(booking)}
                                                        {booking.status === 'complete' && (
                                                            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wide">
                                                                <Check className="w-3.5 h-3.5" /> Completed
                                                            </span>
                                                        )}
                                                        {booking.status === 'cancelled' && (
                                                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-wide">
                                                                Cancelled
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* C. Ratings & Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <motion.div
                                key="reviews"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Client Ratings & Feedback</h1>
                                    <p className="text-sm text-slate-500 mt-1">Review verified testimonials, star scores, and constructive feedback from served patients.</p>
                                </div>

                                {reviewsLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2].map(i => <div key={i} className="h-40 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)}
                                    </div>
                                ) : !reviewsData?.result || reviewsData.result.length === 0 ? (
                                    <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-100 max-w-md mx-auto space-y-4 shadow-xs">
                                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg text-slate-700">No reviews received yet</h3>
                                            <p className="text-xs text-muted-foreground">
                                                Reviews will be populated dynamically as soon as patients complete visits and rate your services!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {reviewsData.result.map((review) => (
                                            <Card key={review._id} className="bg-white border-slate-100 shadow-xs">
                                                <CardContent className="p-6 space-y-4">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-100 flex items-center justify-center shrink-0">
                                                                {review.customerId?.profilePhoto ? (
                                                                    <img src={review.customerId.profilePhoto} alt="Patient" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User className="w-5 h-5 text-slate-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-slate-800 leading-tight">{review.customerId?.name || 'Anonymous Patient'}</h4>
                                                                <span className="text-[10px] text-muted-foreground">Booking ID: {review.bookingId?.bookingNumber}</span>
                                                            </div>
                                                        </div>

                                                        {/* Stars */}
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star 
                                                                    key={s} 
                                                                    className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                                                        "{review.comment || 'No written feedback provided.'}"
                                                    </p>

                                                    <div className="text-[10px] text-slate-400 text-right">
                                                        Rated on: {new Date(review.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* D. My Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Clinical Console Settings</h1>
                                    <p className="text-sm text-slate-500 mt-1">Manage your active licensing address, payout bank accounts, and secure password credentials.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                    {/* Left Uploader widget */}
                                    <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col items-center text-center shadow-xs">
                                        <div className="relative group mb-6">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500/10 shadow-lg bg-slate-100 flex items-center justify-center relative">
                                                {avatarPreviewUrl ? (
                                                    <img src={avatarPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : liveProfile?.profilePhoto ? (
                                                    <img src={liveProfile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-16 h-16 text-slate-300" />
                                                )}
                                            </div>

                                            <label 
                                                htmlFor="nurse-avatar-uploader"
                                                className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300"
                                            >
                                                <Camera className="w-5 h-5" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                                            </label>
                                            <input 
                                                id="nurse-avatar-uploader"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                                ref={avatarInputRef}
                                            />
                                        </div>

                                        <h4 className="font-extrabold text-lg text-slate-800 leading-tight">{liveAuth?.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Licenced Professional</p>

                                        {files.profilePhoto && (
                                            <div className="mt-4 w-full space-y-2">
                                                <p className="text-[10px] text-teal-600 font-semibold bg-teal-50 p-2 rounded-lg leading-normal">
                                                    New profile photo chosen! Make sure to save details below to sync with the database.
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedAvatarFile(null)
                                                        setAvatarPreviewUrl('')
                                                        if (avatarInputRef.current) avatarInputRef.current.value = ''
                                                    }}
                                                    className="text-slate-500 hover:text-slate-800 text-xs font-bold"
                                                >
                                                    Cancel Preview
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Details Forms */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Card 1: Main details form */}
                                        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
                                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                                                <UserCheck className="w-5 h-5 text-teal-600 shrink-0" />
                                                Licensing & Contact Details
                                            </h3>

                                            <form onSubmit={handleKycSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.name}
                                                            onChange={(e) => setKycForm({ ...kycForm, name: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mobile Number</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.mobile}
                                                            onChange={(e) => setKycForm({ ...kycForm, mobile: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                            Email Address
                                                            <Lock className="w-3 h-3 text-slate-400" />
                                                        </Label>
                                                        <Input
                                                            disabled
                                                            value={liveAuth?.email || ''}
                                                            className="h-11 border-slate-100 bg-slate-50/50 text-slate-500 cursor-not-allowed rounded-xl text-sm"
                                                        />
                                                        <span className="text-[10px] text-slate-400 block leading-normal pt-1">
                                                            Email addresses are permanently locked to preserve state registry licensing profiles.
                                                        </span>
                                                    </div>

                                                    {/* Address details */}
                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Street Address</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.street}
                                                            onChange={(e) => setKycForm({ ...kycForm, street: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">City</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.city}
                                                            onChange={(e) => setKycForm({ ...kycForm, city: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">State</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.state}
                                                            onChange={(e) => setKycForm({ ...kycForm, state: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pincode</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.pin}
                                                            onChange={(e) => setKycForm({ ...kycForm, pin: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>

                                                    {/* Professional details */}
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Specialization</Label>
                                                        <select
                                                            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus-visible:ring-teal-500"
                                                            value={kycForm.specialization}
                                                            onChange={(e) => setKycForm({ ...kycForm, specialization: e.target.value })}
                                                        >
                                                            <option value="General Nursing">General Nursing</option>
                                                            <option value="Post-Surgery Care">Post-Surgery Care</option>
                                                            <option value="Elder Care">Elder Care</option>
                                                            <option value="Home ICU Care">Home ICU Care</option>
                                                            <option value="Injection / IV Administration">Injection / IV Administration</option>
                                                            <option value="Dressing Change">Dressing Change</option>
                                                        </select>
                                                    </div>

                                                    {/* Bank detailes form */}
                                                    <div className="space-y-2 sm:col-span-2">
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 mt-2 border-t pt-4">Bank Details (For Payouts)</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bank Name</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.bankName}
                                                            onChange={(e) => setKycForm({ ...kycForm, bankName: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Number</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.accountNumber}
                                                            onChange={(e) => setKycForm({ ...kycForm, accountNumber: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">IFSC Code</Label>
                                                        <Input
                                                            required
                                                            value={kycForm.ifscCode}
                                                            onChange={(e) => setKycForm({ ...kycForm, ifscCode: e.target.value })}
                                                            className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-slate-50">
                                                    <Button
                                                        type="submit"
                                                        disabled={updatingProfile}
                                                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-11 px-6 rounded-xl transition-all shadow-md shadow-teal-600/10 hover:shadow-lg"
                                                    >
                                                        {updatingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>

                                        {/* Card 2: Password secure update */}
                                        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
                                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                                                <Key className="w-5 h-5 text-amber-500 shrink-0" />
                                                Console Password Security
                                            </h3>

                                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                                <div className="space-y-4">
                                                    {/* Current Pass */}
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</Label>
                                                        <div className="relative">
                                                            <Input
                                                                required
                                                                type={showCurrentPass ? 'text' : 'password'}
                                                                placeholder="Enter current password"
                                                                value={passwordForm.currentPassword}
                                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                                className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm pr-10"
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
                                                                    className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm pr-10"
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
                                                                    placeholder="Confirm password"
                                                                    value={passwordForm.confirmPassword}
                                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                                    className="h-11 border-slate-200 focus-visible:ring-teal-500 rounded-xl text-sm pr-10"
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

                                                    {/* Checklist */}
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                                                        <span className="font-bold text-slate-700 block uppercase tracking-wider mb-1">Password Strength Checklist:</span>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isMinLength ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Minimum 8 characters length
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${hasUppercase ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 uppercase letter
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${hasLowercase ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 lowercase letter
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 number digit
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${hasSpecial ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                            Includes at least 1 special character
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-slate-50">
                                                    <Button
                                                        type="submit"
                                                        disabled={passwordUpdating}
                                                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold h-11 px-6 rounded-xl transition-all shadow-md"
                                                    >
                                                        {passwordUpdating ? 'Updating password...' : 'Update Password'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            )}
                        </AnimatePresence>
                    )
                }
            </main>

            {/* Decline Reason Modal overlay */}
            <AnimatePresence>
                {declineBookingId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                            onClick={() => setDeclineBookingId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full relative z-10 border border-rose-100"
                        >
                            <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-rose-600" />
                                Decline shift request?
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Providing a valid cancellation reason helps administrators reschedule this visit quickly.
                            </p>

                            <form onSubmit={handleDeclineSubmit} className="mt-4 space-y-4">
                                <div className="space-y-1">
                                    <Label>Decline reason</Label>
                                    <textarea
                                        required
                                        className="w-full min-h-[80px] p-3 rounded-md border border-input text-sm"
                                        placeholder="e.g. Schedule clash, too far from current service radius, clinical mismatch..."
                                        value={declineReason}
                                        onChange={(e) => setDeclineReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDeclineBookingId(null)}
                                    >
                                        Keep Shift
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                                    >
                                        Decline Shift
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NurseDashboard

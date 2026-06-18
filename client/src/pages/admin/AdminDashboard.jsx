import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    Heart, ShieldAlert, Award, Stethoscope, Users, Briefcase, DollarSign,
    CheckCircle2, XCircle, Clock, MapPin, Plus, Edit3, Trash2, ArrowRight,
    RefreshCw, LogOut, FileText, Check, ShieldCheck, Search, Info, ExternalLink,
    Calendar, ChevronLeft, ChevronRight, Star, Eye, EyeOff
} from 'lucide-react'
import { logoutAdmin } from '@/redux/slice/authSlice'
import { useLogoutAdminMutation } from '@/redux/apis/authApi'
import {
    useGetAllNursesQuery,
    useGetPendingNursesQuery,
    useApproveNurseMutation,
    useRejectNurseMutation,
    useSuspendNurseMutation,
    useGetAllCustomersQuery,
    useBlockCustomerMutation,
    useUnblockCustomerMutation,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeactivateServiceMutation,
    useActivateServiceMutation,
    useGetAllBookingsQuery,
    useGetAvailableNursesQuery,
    useAssignNurseMutation,
    useConfirmCashPaymentMutation,
    useRefundPaymentMutation,
    useCreateMilestoneMutation,
    useDeleteMilestoneMutation,
    useGetAllFeedbacksQuery,
    useToggleFeedbackVisibilityMutation,
    useDeleteFeedbackMutation
} from '@/redux/apis/adminApi'
import { useGetAllServicesQuery, useGetMilestonesQuery } from '@/redux/apis/bookingApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const admin = useSelector(state => state.auth.admin)

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login')
        }
    }, [admin, navigate])

    const [logoutAdminMutation] = useLogoutAdminMutation()

    // Side Navigation Tabs
    const [activeTab, setActiveTab] = useState('overview')

    // RTK Queries & Mutations
    const { data: nursesData, isLoading: nursesLoading, refetch: refetchNurses } = useGetAllNursesQuery(undefined, {
        pollingInterval: 15000
    })
    const { data: pendingNursesData, isLoading: pendingNursesLoading, refetch: refetchPendingNurses } = useGetPendingNursesQuery()
    const { data: customersData, isLoading: customersLoading, refetch: refetchCustomers } = useGetAllCustomersQuery()
    const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useGetAllBookingsQuery()
    const { data: servicesData, isLoading: servicesLoading, refetch: refetchServices } = useGetAllServicesQuery()

    const [approveNurse] = useApproveNurseMutation()
    const [rejectNurse] = useRejectNurseMutation()
    const [suspendNurse] = useSuspendNurseMutation()
    const [blockCustomer] = useBlockCustomerMutation()
    const [unblockCustomer] = useUnblockCustomerMutation()
    const [createService, { isLoading: creatingService }] = useCreateServiceMutation()
    const [deactivateService] = useDeactivateServiceMutation()
    const [activateService] = useActivateServiceMutation()
    const [assignNurse] = useAssignNurseMutation()
    const [confirmCashPayment] = useConfirmCashPaymentMutation()
    const [refundPayment] = useRefundPaymentMutation()

    // Dispatcher states
    const [dispatchBookingId, setDispatchBookingId] = useState(null)
    const [selectedNurseForBooking, setSelectedNurseForBooking] = useState('')
    const { data: availableNursesData, isLoading: availableLoading } = useGetAvailableNursesQuery(dispatchBookingId, {
        skip: !dispatchBookingId
    })

    // Service Creator form states
    const [newService, setNewService] = useState({
        name: '',
        category: 'Nursing',
        description: '',
        price: '',
        durationHours: '2',
        requiredQualification: 'GNM'
    })

    // Milestones state & mutations
    const { data: milestonesData, isLoading: milestonesLoading, refetch: refetchMilestones } = useGetMilestonesQuery()
    const [createMilestone, { isLoading: creatingMilestone }] = useCreateMilestoneMutation()
    const [deleteMilestone, { isLoading: deletingMilestone }] = useDeleteMilestoneMutation()

    // Feedbacks state & mutations
    const { data: feedbacksData, isLoading: feedbacksLoading, refetch: refetchFeedbacks } = useGetAllFeedbacksQuery()
    const [toggleFeedbackVisibility] = useToggleFeedbackVisibilityMutation()
    const [deleteFeedback] = useDeleteFeedbackMutation()

    const handleFeedbackToggleShow = async (id) => {
        try {
            const res = await toggleFeedbackVisibility(id).unwrap()
            toast.success(res.message || 'Feedback visibility updated')
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to toggle visibility')
        }
    }

    const handleFeedbackDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this feedback?')) return
        try {
            await deleteFeedback(id).unwrap()
            toast.success('Feedback deleted successfully')
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to delete feedback')
        }
    }

    const [newMilestone, setNewMilestone] = useState({
        year: '',
        title: '',
        desc: ''
    })

    const handleMilestoneSubmit = async (e) => {
        e.preventDefault()
        if (!newMilestone.year || !newMilestone.title || !newMilestone.desc) {
            toast.error('All fields are required')
            return
        }
        try {
            await createMilestone(newMilestone).unwrap()
            toast.success('New milestone added successfully!')
            setNewMilestone({ year: '', title: '', desc: '' })
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to add milestone')
        }
    }

    const handleMilestoneDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this milestone?')) return
        try {
            await deleteMilestone(id).unwrap()
            toast.success('Milestone deleted successfully')
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to delete milestone')
        }
    }

    // KYC rejection reason states
    const [rejectionNurseId, setRejectionNurseId] = useState(null)
    const [rejectionFeedback, setRejectionFeedback] = useState('')

    // Collapsible Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Nurses Directory Filters & Pagination States
    const [nurseSearch, setNurseSearch] = useState('')
    const [nurseQualFilter, setNurseQualFilter] = useState('All')
    const [nurseStatusFilter, setNurseStatusFilter] = useState('All')
    const [nurseSortBy, setNurseSortBy] = useState('name')
    const [nurseSortOrder, setNurseSortOrder] = useState('asc')
    const [nursePage, setNursePage] = useState(1)
    const nurseItemsPerPage = 5

    // Customers Directory Filters & Pagination States
    const [custSearch, setCustSearch] = useState('')
    const [custStatusFilter, setCustStatusFilter] = useState('All')
    const [custSortBy, setCustSortBy] = useState('name')
    const [custSortOrder, setCustSortOrder] = useState('asc')
    const [custPage, setCustPage] = useState(1)
    const custItemsPerPage = 5

    // Filter and Search Nurses
    const filteredNurses = nursesData?.result?.filter(nurse => {
        const name = nurse.nurseId?.name || ''
        const email = nurse.nurseId?.email || ''
        const mobile = nurse.nurseId?.mobile || ''
        
        const matchesSearch = name.toLowerCase().includes(nurseSearch.toLowerCase()) ||
            email.toLowerCase().includes(nurseSearch.toLowerCase()) ||
            mobile.includes(nurseSearch)

        const matchesQual = nurseQualFilter === 'All' || nurse.qualification === nurseQualFilter
        const matchesStatus = nurseStatusFilter === 'All' || nurse.verificationStatus === nurseStatusFilter

        return matchesSearch && matchesQual && matchesStatus
    }) || []

    // Sort Nurses
    const sortedNurses = [...filteredNurses].sort((a, b) => {
        let valA, valB
        if (nurseSortBy === 'name') {
            valA = (a.nurseId?.name || '').toLowerCase()
            valB = (b.nurseId?.name || '').toLowerCase()
        } else if (nurseSortBy === 'experience') {
            valA = Number(a.experienceYear) || 0
            valB = Number(b.experienceYear) || 0
        } else {
            valA = new Date(a.createdAt || 0).getTime()
            valB = new Date(b.createdAt || 0).getTime()
        }

        if (valA < valB) return nurseSortOrder === 'asc' ? -1 : 1
        if (valA > valB) return nurseSortOrder === 'asc' ? 1 : -1
        return 0
    })

    // Paginate Nurses
    const totalNursePages = Math.ceil(sortedNurses.length / nurseItemsPerPage) || 1
    const paginatedNurses = sortedNurses.slice((nursePage - 1) * nurseItemsPerPage, nursePage * nurseItemsPerPage)

    // Filter and Search Customers
    const filteredCustomers = customersData?.result?.filter(cust => {
        const name = cust.name || ''
        const email = cust.email || ''
        const mobile = cust.mobile || ''

        const matchesSearch = name.toLowerCase().includes(custSearch.toLowerCase()) ||
            email.toLowerCase().includes(custSearch.toLowerCase()) ||
            mobile.includes(custSearch)

        const matchesStatus = custStatusFilter === 'All' || 
            (custStatusFilter === 'Active' && cust.isActive) ||
            (custStatusFilter === 'Blocked' && !cust.isActive)

        return matchesSearch && matchesStatus
    }) || []

    // Sort Customers
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        let valA, valB
        if (custSortBy === 'name') {
            valA = (a.name || '').toLowerCase()
            valB = (b.name || '').toLowerCase()
        } else {
            valA = new Date(a.createdAt || 0).getTime()
            valB = new Date(b.createdAt || 0).getTime()
        }

        if (valA < valB) return custSortOrder === 'asc' ? -1 : 1
        if (valA > valB) return custSortOrder === 'asc' ? 1 : -1
        return 0
    })

    // Paginate Customers
    const totalCustPages = Math.ceil(sortedCustomers.length / custItemsPerPage) || 1
    const paginatedCustomers = sortedCustomers.slice((custPage - 1) * custItemsPerPage, custPage * custItemsPerPage)

    const handleLogout = async () => {
        try {
            await logoutAdminMutation().unwrap()
            dispatch(logoutAdmin())
            toast.success('Logged out successfully')
            navigate('/')
        } catch (error) {
            toast.error('Logout failed')
        }
    }

    const handleApprove = async (nurseId) => {
        try {
            await approveNurse(nurseId).unwrap()
            toast.success('Nurse credentials verified and approved!')
            refetchPendingNurses()
            refetchNurses()
        } catch (error) {
            toast.error(error?.data?.message || 'Verification failed')
        }
    }

    const handleRejectSubmit = async (e) => {
        e.preventDefault()
        try {
            await rejectNurse({
                nurseId: rejectionNurseId,
                rejectionReason: rejectionFeedback
            }).unwrap()
            toast.success('Nurse KYC request rejected with feedback')
            setRejectionNurseId(null)
            setRejectionFeedback('')
            refetchPendingNurses()
        } catch (error) {
            toast.error(error?.data?.message || 'Rejection failed')
        }
    }

    const handleServiceSubmit = async (e) => {
        e.preventDefault()
        try {
            await createService({
                ...newService,
                price: Number(newService.price),
                durationHours: Number(newService.durationHours)
            }).unwrap()
            toast.success('New clinical care service created successfully!')
            setNewService({
                name: '',
                category: 'Nursing',
                description: '',
                price: '',
                durationHours: '2',
                requiredQualification: 'GNM'
            })
            refetchServices()
        } catch (error) {
            toast.error(error?.data?.message || 'Creation failed')
        }
    }

    const handleToggleService = async (service) => {
        try {
            if (service.isActive) {
                await deactivateService(service._id).unwrap()
                toast.success('Service deactivated from patient view')
            } else {
                await activateService(service._id).unwrap()
                toast.success('Service activated on patient view')
            }
            refetchServices()
        } catch (error) {
            toast.error(error?.data?.message || 'Operation failed')
        }
    }

    const handleDispatchSubmit = async () => {
        if (!selectedNurseForBooking) {
            toast.error('Please select an available nurse first')
            return
        }
        try {
            await assignNurse({
                bookingId: dispatchBookingId,
                nurseId: selectedNurseForBooking
            }).unwrap()
            toast.success('Nurse assigned successfully!')
            setDispatchBookingId(null)
            setSelectedNurseForBooking('')
            refetchBookings()
        } catch (error) {
            toast.error(error?.data?.message || 'Assignment failed')
        }
    }

    const handleConfirmCash = async (bookingId) => {
        try {
            await confirmCashPayment(bookingId).unwrap()
            toast.success('Cash payment confirmed!')
            refetchBookings()
        } catch (error) {
            toast.error(error?.data?.message || 'Confirmation failed')
        }
    }

    const handleRefund = async (bookingId) => {
        try {
            await refundPayment(bookingId).unwrap()
            toast.success('Refund completed successfully!')
            refetchBookings()
        } catch (error) {
            toast.error(error?.data?.message || 'Refund failed')
        }
    }

    // Calculations for Analytics Dashboard
    const totalRevenue = bookingsData?.result
        ?.filter(b => b.paymentStatus === 'paid')
        ?.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0

    const activeBookingsCount = bookingsData?.result
        ?.filter(b => ['nurse_assigned', 'nurse_accepted', 'on_route', 'in_progress'].includes(b.status))
        ?.length || 0

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

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Collapsible side navbar */}
            <aside className={`bg-slate-900 text-slate-300 flex flex-col justify-between p-5 border-r border-slate-800 transition-all duration-300 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20 px-3'}`}>
                <div className="space-y-8">
                    <div className="flex items-center justify-between pt-2">
                        {isSidebarOpen ? (
                            <div className="flex items-center gap-2">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <Heart className="w-5 h-5 text-white fill-white/20" />
                                </div>
                                <span className="font-extrabold text-white text-lg tracking-tight">CareNest Admin</span>
                            </div>
                        ) : (
                            <div className="bg-primary p-1.5 rounded-lg mx-auto">
                                <Heart className="w-5 h-5 text-white fill-white/20" />
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            {isSidebarOpen ? (
                                <ChevronLeft className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1.5">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3' : 'justify-center'} ${activeTab === 'overview' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Operations Overview"
                        >
                            <Users className="w-4 h-4 shrink-0" />
                            {isSidebarOpen && <span>Operations Overview</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab('nurses')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3' : 'justify-center'} ${activeTab === 'nurses' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Nurses Directory"
                        >
                            <Stethoscope className="w-4 h-4 shrink-0" />
                            {isSidebarOpen && <span>Nurses Directory</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab('customers')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3' : 'justify-center'} ${activeTab === 'customers' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Patients Directory"
                        >
                            <Users className="w-4 h-4 shrink-0" />
                            {isSidebarOpen && <span>Patients Directory</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab('kyc')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3 justify-between' : 'justify-center'} ${activeTab === 'kyc' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Nurse KYC Desk"
                        >
                            <span className="flex items-center gap-3">
                                <Award className="w-4 h-4 shrink-0" />
                                {isSidebarOpen && <span>Nurse KYC Desk</span>}
                            </span>
                            {isSidebarOpen && pendingNursesData?.result?.length > 0 && (
                                <span className="bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse shrink-0">
                                    {pendingNursesData.result.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('services')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3' : 'justify-center'} ${activeTab === 'services' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Service Catalog"
                        >
                            <Briefcase className="w-4 h-4 shrink-0" />
                            {isSidebarOpen && <span>Service Catalog</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3' : 'justify-center'} ${activeTab === 'bookings' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Visits Dispatcher"
                        >
                            <Calendar className="w-4 h-4 shrink-0" />
                            {isSidebarOpen && <span>Visits Dispatcher</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab('milestones')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3' : 'justify-center'} ${activeTab === 'milestones' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Company Journey"
                        >
                            <Award className="w-4 h-4 shrink-0" />
                            {isSidebarOpen && <span>Company Journey</span>}
                        </button>

                        <button
                            onClick={() => setActiveTab('feedbacks')}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-colors ${isSidebarOpen ? 'gap-3' : 'justify-center'} ${activeTab === 'feedbacks' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            title="Patient Feedbacks"
                        >
                            <Star className="w-4 h-4 shrink-0" />
                            {isSidebarOpen && <span>Patient Feedbacks</span>}
                        </button>
                    </nav>
                </div>

                <div className="pt-5 border-t border-slate-800 space-y-4">
                    {isSidebarOpen ? (
                        <div className="px-2">
                            <p className="text-xs font-semibold text-slate-500">Logged in as</p>
                            <p className="text-sm font-bold text-white truncate">{admin?.name}</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Users className="w-5 h-5 mx-auto text-slate-400" title={admin?.name} />
                        </div>
                    )}
                    <Button
                        onClick={handleLogout}
                        className={`w-full bg-slate-800 hover:bg-slate-700 text-white border-0 ${isSidebarOpen ? '' : 'px-0'}`}
                    >
                        <LogOut className={`w-4 h-4 ${isSidebarOpen ? 'mr-2' : ''}`} />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 overflow-y-auto p-8 max-h-screen">
                {/* 1. OPERATIONS OVERVIEW PANEL */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Operations Overview</h1>
                            <p className="text-sm text-slate-500 mt-1">Platform operations, billing revenue totals, and live active visits.</p>
                        </div>

                        {/* Top Summary widgets */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                            <Card className="bg-white border-0 shadow-xs">
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Paid Revenue (INR)</p>
                                        <p className="text-2xl font-extrabold text-slate-800 mt-1">₹{totalRevenue}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-xs">
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Visits</p>
                                        <p className="text-2xl font-extrabold text-slate-800 mt-1">{activeBookingsCount}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-xs">
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Verified Nurses</p>
                                        <p className="text-2xl font-extrabold text-slate-800 mt-1">{nursesData?.result?.length || 0}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <Stethoscope className="w-5 h-5 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-xs">
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Patients Registered</p>
                                        <p className="text-2xl font-extrabold text-slate-800 mt-1">{customersData?.result?.length || 0}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* SVG area Graph Card */}
                        <Card className="bg-white border-0 shadow-xs overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-slate-800">Platform Analytics & Weekly Revenue Trend</CardTitle>
                                <CardDescription>Monitored volume of care assignments, daily bookings, and net revenue flow in INR.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="w-full h-64 bg-slate-900/5 rounded-3xl p-4 relative flex flex-col justify-between overflow-hidden border border-slate-100">
                                    <svg viewBox="0 0 500 200" className="w-full h-48 drop-shadow-md overflow-visible">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="oklch(0.491 0.27 292.581)" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="oklch(0.491 0.27 292.581)" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>
                                        <line x1="0" y1="40" x2="500" y2="40" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                                        <line x1="0" y1="80" x2="500" y2="80" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                                        <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                                        <line x1="0" y1="160" x2="500" y2="160" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                                        
                                        <path
                                            d="M 0 160 Q 80 120 160 140 T 320 80 T 420 60 L 500 160 L 0 160 Z"
                                            fill="url(#chartGradient)"
                                        />
                                        <path
                                            d="M 0 160 Q 80 120 160 140 T 320 80 T 420 60"
                                            fill="none"
                                            stroke="oklch(0.491 0.27 292.581)"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                        />
                                        <circle cx="160" cy="140" r="5" fill="#ffffff" stroke="oklch(0.491 0.27 292.581)" strokeWidth="2.5" />
                                        <circle cx="320" cy="80" r="5" fill="#ffffff" stroke="oklch(0.491 0.27 292.581)" strokeWidth="2.5" />
                                        <circle cx="420" cy="60" r="5" fill="#ffffff" stroke="#2dd4bf" strokeWidth="2.5" />
                                    </svg>
                                    
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase px-2">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun (Today)</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6 mt-4 text-xs font-semibold justify-center text-slate-600">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-primary block"></span>
                                        Weekly Bookings volume
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-teal-400 block"></span>
                                        Completed Payments flow
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions Table */}
                        <Card className="bg-white border-0 shadow-xs overflow-hidden">
                            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-800">Recent Transactions & Bookings</CardTitle>
                                    <CardDescription>Live overview of incoming client schedules and billing records.</CardDescription>
                                </div>
                                <Button size="sm" variant="ghost" onClick={refetchBookings} className="text-primary hover:bg-purple-50">
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {!bookingsData?.result || bookingsData.result.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">No recent transactions recorded.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                                                    <th className="p-4">Booking No.</th>
                                                    <th className="p-4">Customer</th>
                                                    <th className="p-4">Requested Service</th>
                                                    <th className="p-4">Date</th>
                                                    <th className="p-4">Total Amount</th>
                                                    <th className="p-4">Billing Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm">
                                                {bookingsData.result.slice(0, 5).map(b => (
                                                    <tr key={b._id} className="hover:bg-slate-50/50">
                                                        <td className="p-4 font-mono text-xs font-bold text-slate-800">{b.bookingNumber}</td>
                                                        <td className="p-4">
                                                            <p className="font-bold text-slate-800">{b.customerId?.name || 'Customer'}</p>
                                                            <p className="text-[11px] text-slate-500">{b.customerId?.email || 'N/A'}</p>
                                                        </td>
                                                        <td className="p-4 font-semibold text-slate-700">{b.serviceId?.name || 'Nursing Visit'}</td>
                                                        <td className="p-4 text-slate-600">
                                                            {new Date(b.prefrenceDate || Date.now()).toLocaleDateString('en-IN', {
                                                                day: '2-digit', month: 'short', year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="p-4 font-bold text-slate-900">₹{b.totalAmount}</td>
                                                        <td className="p-4">
                                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-sm border ${
                                                                b.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                            }`}>
                                                                {(b.paymentStatus || 'pending').toUpperCase()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 2. NURSE KYC VERIFICATION DESK */}
                {activeTab === 'kyc' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Nurse KYC Desk</h1>
                                <p className="text-sm text-slate-500 mt-1">Review medical degrees, licensing certificates, and identity files to authorize caregivers.</p>
                            </div>
                            <Button size="sm" onClick={refetchPendingNurses} className="bg-primary hover:bg-primary/95 text-white">
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Queue
                            </Button>
                        </div>

                        <Card className="bg-white border-0 shadow-xs overflow-hidden">
                            <CardContent className="p-0">
                                {pendingNursesLoading ? (
                                    <div className="p-12 text-center text-slate-400">Loading KYC queue...</div>
                                ) : pendingNursesData?.result?.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400 space-y-2">
                                        <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto" />
                                        <h3 className="font-semibold text-slate-700">Verification queue is clear!</h3>
                                        <p className="text-xs text-slate-400">No pending nurse registrations are currently awaiting review.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-100">
                                                    <th className="p-4">Caregiver</th>
                                                    <th className="p-4">Qualification / Exp</th>
                                                    <th className="p-4">Reg ID No</th>
                                                    <th className="p-4">Certificates</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm">
                                                {pendingNursesData.result.map((profile) => (
                                                    <tr key={profile._id} className="hover:bg-slate-50/50">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={profile.profilePhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'}
                                                                    alt={profile.nurseId?.name}
                                                                    className="w-10 h-10 rounded-full object-cover border"
                                                                />
                                                                <div>
                                                                    <p className="font-bold text-slate-800">{profile.nurseId?.name}</p>
                                                                    <p className="text-xs text-slate-500">{profile.nurseId?.email} • {profile.nurseId?.mobile}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="font-bold text-slate-700">{profile.qualification}</p>
                                                            <p className="text-xs text-slate-500">{profile.experienceYear} Years Exp</p>
                                                        </td>
                                                        <td className="p-4 font-mono text-xs font-semibold text-slate-600">{profile.nursingCouncilRegNo}</td>
                                                        <td className="p-4">
                                                            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                                                                <a href={profile.documents?.degreeCertificate} target="_blank" rel="noreferrer" className="bg-purple-50 text-primary border border-purple-100 px-2 py-0.5 rounded-sm hover:underline flex items-center gap-1">
                                                                    Degree <ExternalLink className="w-2.5 h-2.5" />
                                                                </a>
                                                                <a href={profile.documents?.nursingCouncilCertificate} target="_blank" rel="noreferrer" className="bg-purple-50 text-primary border border-purple-100 px-2 py-0.5 rounded-sm hover:underline flex items-center gap-1">
                                                                    License <ExternalLink className="w-2.5 h-2.5" />
                                                                </a>
                                                                <a href={profile.documents?.idProof} target="_blank" rel="noreferrer" className="bg-purple-50 text-primary border border-purple-100 px-2 py-0.5 rounded-sm hover:underline flex items-center gap-1">
                                                                    Govt ID <ExternalLink className="w-2.5 h-2.5" />
                                                                </a>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleApprove(profile.nurseId?._id)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold"
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setRejectionNurseId(profile.nurseId?._id)}
                                                                    className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 3. SERVICE CATALOG MANAGEMENT */}
                {activeTab === 'services' && (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Service Catalog</h1>
                                <p className="text-sm text-slate-500 mt-1">Configure diagnostic care items, billing rates, and staff requirements.</p>
                            </div>
                            <Button size="sm" onClick={refetchServices} className="bg-primary hover:bg-primary/95 text-white">
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Catalog
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Service Creation Form (Simple Card) */}
                            <Card className="bg-white border-0 shadow-xs lg:col-span-1">
                                <CardHeader className="border-b border-slate-100">
                                    <CardTitle className="text-lg font-bold text-slate-800">Add New Service</CardTitle>
                                    <CardDescription>Setup doorstep nursing or diagnostic packages.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleServiceSubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <Label>Service Name</Label>
                                            <Input
                                                required
                                                placeholder="e.g. IV Drip Injection Setup"
                                                value={newService.name}
                                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Category</Label>
                                            <select
                                                className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                                value={newService.category}
                                                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                            >
                                                <option value="Nursing">Nursing Services</option>
                                                <option value="Pathology Labs">Pathology Labs</option>
                                                <option value="Physiotherapy">Physiotherapy</option>
                                                <option value="ICU Care">ICU Care Services</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Description</Label>
                                            <textarea
                                                required
                                                className="w-full min-h-[70px] p-3 rounded-md border border-input text-xs focus-visible:outline-hidden placeholder-slate-400"
                                                placeholder="Brief details of patient care visit..."
                                                value={newService.description}
                                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Price (INR)</Label>
                                            <Input
                                                required
                                                type="number"
                                                placeholder="e.g. 500"
                                                value={newService.price}
                                                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label>Duration (Hrs)</Label>
                                                <Input
                                                    required
                                                    type="number"
                                                    placeholder="2"
                                                    value={newService.durationHours}
                                                    onChange={(e) => setNewService({ ...newService, durationHours: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Staff Qualification</Label>
                                                <select
                                                    className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                                    value={newService.requiredQualification}
                                                    onChange={(e) => setNewService({ ...newService, requiredQualification: e.target.value })}
                                                >
                                                    <option value="ANM">ANM</option>
                                                    <option value="GNM">GNM</option>
                                                    <option value="B.Sc">B.Sc Nursing</option>
                                                    <option value="M.Sc">M.Sc Nursing</option>
                                                </select>
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={creatingService} className="w-full bg-primary hover:bg-primary/95 text-white font-bold mt-2">
                                            {creatingService ? 'Saving service...' : 'Add to Catalog'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Service catalog Table */}
                            <Card className="bg-white border-0 shadow-xs lg:col-span-2 overflow-hidden">
                                <CardContent className="p-0">
                                    {servicesLoading ? (
                                        <div className="p-12 text-center text-slate-400">Loading catalog items...</div>
                                    ) : servicesData?.result?.length === 0 ? (
                                        <div className="p-12 text-center text-slate-400">Catalog is empty. Add services above!</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-100">
                                                        <th className="p-4">Service Profile</th>
                                                        <th className="p-4">Price</th>
                                                        <th className="p-4">Duration</th>
                                                        <th className="p-4">Min. Staff</th>
                                                        <th className="p-4">Status</th>
                                                        <th className="p-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-sm">
                                                    {servicesData.result.map((service) => (
                                                        <tr key={service._id} className="hover:bg-slate-50/50">
                                                            <td className="p-4">
                                                                <p className="font-bold text-slate-800">{service.name}</p>
                                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{service.description}</p>
                                                                <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1">
                                                                    {service.category}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 font-bold text-slate-900">₹{service.price}</td>
                                                            <td className="p-4 text-slate-600 font-semibold">{service.durationHours} Hours</td>
                                                            <td className="p-4">
                                                                <span className="bg-purple-50 text-primary border border-purple-100 font-bold text-xs px-2 py-0.5 rounded-sm">
                                                                    {service.requiredQualification}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-sm border ${
                                                                    service.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                                                                }`}>
                                                                    {service.isActive ? 'ACTIVE' : 'DEACTIVE'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                {service.isActive ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={async () => {
                                                                            await deactivateService(service._id).unwrap()
                                                                            toast.success('Service deactivated successfully')
                                                                            refetchServices()
                                                                        }}
                                                                        className="text-amber-600 hover:bg-amber-50 text-xs font-semibold"
                                                                    >
                                                                        Deactivate
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={async () => {
                                                                            await activateService(service._id).unwrap()
                                                                            toast.success('Service activated successfully!')
                                                                            refetchServices()
                                                                        }}
                                                                        className="text-green-600 hover:bg-green-50 text-xs font-semibold"
                                                                    >
                                                                        Activate
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* 4. VISITS DISPATCHER & MANAGEMENT */}
                {activeTab === 'bookings' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Visits Dispatcher</h1>
                                <p className="text-sm text-slate-500 mt-1">Assign verified caregivers, confirm cash payouts, and monitor active visits.</p>
                            </div>
                            <Button size="sm" onClick={refetchBookings} className="bg-primary hover:bg-primary/95 text-white">
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Schedules
                            </Button>
                        </div>

                        <Card className="bg-white border-0 shadow-xs overflow-hidden">
                            <CardContent className="p-0">
                                {bookingsLoading ? (
                                    <div className="p-12 text-center text-slate-400">Loading platform visits...</div>
                                ) : bookingsData?.result?.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">No nursing visits scheduled yet.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-100">
                                                    <th className="p-4">Booking No / Patient</th>
                                                    <th className="p-4">Care Visit Info</th>
                                                    <th className="p-4">Address</th>
                                                    <th className="p-4">Requested Date</th>
                                                    <th className="p-4">Assigned Partner</th>
                                                    <th className="p-4">Status & Payout</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm">
                                                {bookingsData.result.map((booking) => (
                                                    <tr key={booking._id} className="hover:bg-slate-50/50">
                                                        <td className="p-4">
                                                            <p className="font-mono text-xs font-bold text-slate-800">{booking.bookingNumber}</p>
                                                            <p className="font-bold text-slate-800 mt-0.5">{booking.patientDetails?.name || 'Patient'}</p>
                                                            <p className="text-[11px] text-slate-500">Age: {booking.patientDetails?.age} • Gen: {booking.patientDetails?.gender}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="font-semibold text-slate-700">{booking.serviceId?.name || 'Nursing Visit'}</p>
                                                            <p className="text-xs text-slate-500">Rate: ₹{booking.totalAmount}</p>
                                                            <span className="inline-block bg-purple-50 text-primary border border-purple-100 text-[10px] font-bold px-1.5 py-0.2 rounded-sm mt-1">
                                                                Pref: {(booking.nurseGenderPreference || 'any').toUpperCase()} NURSE
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="text-xs text-slate-600 font-semibold truncate max-w-[150px]">{booking.serviceAddress?.fullAddress}</p>
                                                            <p className="text-[11px] text-slate-500">{booking.serviceAddress?.city} • {booking.serviceAddress?.pinCode}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="font-semibold text-slate-700">
                                                                {new Date(booking.prefrenceDate || Date.now()).toLocaleDateString('en-IN', {
                                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                                })}
                                                            </p>
                                                            <p className="text-xs text-slate-500">Slot: {booking.timeSlot}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            {booking.assignedNurseId ? (
                                                                <div>
                                                                    <p className="font-bold text-slate-800 flex items-center gap-1">
                                                                        {booking.assignedNurseId?.name}
                                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">{booking.assignedNurseId?.mobile}</p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-amber-500 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-sm">UNASSIGNED</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="space-y-1.5">
                                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-sm border block w-fit ${getStatusColor(booking.status)}`}>
                                                                    {(booking.status || 'pending').toUpperCase()}
                                                                </span>
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border block w-fit ${
                                                                    booking.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    booking.paymentStatus === 'refunded' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                                }`}>
                                                                    PAY: {(booking.paymentStatus || 'pending').toUpperCase()} ({(booking.paymentMode || 'online').toUpperCase()})
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex flex-col gap-1 items-end">
                                                                {!booking.assignedNurseId && booking.status !== 'cancelled' && (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setDispatchBookingId(booking._id)
                                                                            setSelectedNurseForBooking('')
                                                                        }}
                                                                        className="bg-primary hover:bg-primary/95 text-white text-xs font-bold w-32"
                                                                    >
                                                                        Dispatch Caregiver
                                                                    </Button>
                                                                )}

                                                                {booking.paymentMode === 'cash' && booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={async () => {
                                                                            await confirmCashPayment(booking._id).unwrap()
                                                                            toast.success('Cash payment confirmed successfully!')
                                                                            refetchBookings()
                                                                        }}
                                                                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold w-32"
                                                                    >
                                                                        Confirm Payout
                                                                    </Button>
                                                                )}

                                                                {booking.status === 'cancelled' && booking.paymentStatus === 'paid' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleRefund(booking._id)}
                                                                        className="border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold w-32"
                                                                    >
                                                                        Refund Customer
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 5. NURSES DIRECTORY PANEL */}
                {activeTab === 'nurses' && (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                                    <Stethoscope className="w-8 h-8 text-primary" />
                                    Nurses Directory
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">Search, filter, sort, and manage all caregivers on the platform.</p>
                            </div>
                            <Button size="sm" onClick={refetchNurses} className="bg-primary hover:bg-primary/95 text-white">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin-hover" /> Refetch Nurses
                            </Button>
                        </div>

                        {/* Search & Filters Controls */}
                        <Card className="bg-white border-0 shadow-xs">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    {/* Search input */}
                                    <div className="space-y-1 sm:col-span-2">
                                        <Label>Search Caregiver</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="Search by name, email, or mobile..."
                                                className="pl-10"
                                                value={nurseSearch}
                                                onChange={(e) => {
                                                    setNurseSearch(e.target.value)
                                                    setNursePage(1)
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Filter by Qualification */}
                                    <div className="space-y-1">
                                        <Label>Qualification</Label>
                                        <select
                                            className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                            value={nurseQualFilter}
                                            onChange={(e) => {
                                                setNurseQualFilter(e.target.value)
                                                setNursePage(1)
                                            }}
                                        >
                                            <option value="All">All Qualifications</option>
                                            <option value="ANM">ANM</option>
                                            <option value="GNM">GNM</option>
                                            <option value="B.Sc">B.Sc</option>
                                            <option value="M.Sc">M.Sc</option>
                                        </select>
                                    </div>

                                    {/* Filter by Verification Status */}
                                    <div className="space-y-1">
                                        <Label>Verification Status</Label>
                                        <select
                                            className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                            value={nurseStatusFilter}
                                            onChange={(e) => {
                                                setNurseStatusFilter(e.target.value)
                                                setNursePage(1)
                                            }}
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="reject">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
                                    {/* Sort By */}
                                    <div className="space-y-1">
                                        <Label>Sort By</Label>
                                        <select
                                            className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                            value={nurseSortBy}
                                            onChange={(e) => setNurseSortBy(e.target.value)}
                                        >
                                            <option value="name">Full Name</option>
                                            <option value="experience">Years of Experience</option>
                                            <option value="createdAt">Registration Date</option>
                                        </select>
                                    </div>

                                    {/* Sort Order */}
                                    <div className="space-y-1">
                                        <Label>Sort Order</Label>
                                        <select
                                            className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                            value={nurseSortOrder}
                                            onChange={(e) => setNurseSortOrder(e.target.value)}
                                        >
                                            <option value="asc">Ascending (A-Z / Low-High)</option>
                                            <option value="desc">Descending (Z-A / High-Low)</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Nurses Table */}
                        <Card className="bg-white border-0 shadow-xs overflow-hidden">
                            <CardContent className="p-0">
                                {nursesLoading ? (
                                    <div className="p-12 text-center text-slate-400">Loading nurses directory...</div>
                                ) : paginatedNurses.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">No nurses found matching the selected search/filters.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-100">
                                                    <th className="p-4">Photo</th>
                                                    <th className="p-4">Caregiver Name</th>
                                                    <th className="p-4">Qualification</th>
                                                    <th className="p-4">Reg No</th>
                                                    <th className="p-4">Exp</th>
                                                    <th className="p-4">Availability</th>
                                                    <th className="p-4">KYC Status</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm">
                                                {paginatedNurses.map((nurse) => (
                                                    <tr key={nurse._id} className="hover:bg-slate-50/50">
                                                        <td className="p-4">
                                                            <img
                                                                src={nurse.profilePhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'}
                                                                alt={nurse.nurseId?.name}
                                                                className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-2xs"
                                                            />
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="font-bold text-slate-800">{nurse.nurseId?.name || 'Caregiver'}</p>
                                                            <p className="text-xs text-slate-500">{nurse.nurseId?.email || 'N/A'} • {nurse.nurseId?.mobile || 'N/A'}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="bg-purple-50 text-primary border border-purple-100 px-2 py-0.5 rounded-sm font-bold text-xs">
                                                                {nurse.qualification}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-mono text-xs">{nurse.nursingCouncilRegNo}</td>
                                                        <td className="p-4 font-semibold text-slate-700">{nurse.experienceYear} Years</td>
                                                        <td className="p-4">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${
                                                                nurse.availabilityStatus === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                nurse.availabilityStatus === 'busy' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                                {(nurse.availabilityStatus || 'off_duty').toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-sm border ${
                                                                nurse.verificationStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                nurse.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                                {(nurse.verificationStatus || 'pending').toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {nurse.verificationStatus === 'approved' ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={async () => {
                                                                            await suspendNurse(nurse.nurseId?._id).unwrap()
                                                                            toast.success('Caregiver suspended successfully')
                                                                            refetchNurses()
                                                                        }}
                                                                        className="text-red-600 hover:bg-red-50 text-xs"
                                                                    >
                                                                        Suspend
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={async () => {
                                                                            await approveNurse(nurse.nurseId?._id).unwrap()
                                                                            toast.success('Caregiver credentials approved successfully!')
                                                                            refetchNurses()
                                                                        }}
                                                                        className="text-green-600 hover:bg-green-50 text-xs"
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                            
                            {/* Pagination Controls */}
                            {totalNursePages > 1 && (
                                <CardFooter className="bg-slate-50 border-t border-slate-100 flex items-center justify-between p-4">
                                    <span className="text-xs text-slate-500">
                                        Showing page <strong>{nursePage}</strong> of <strong>{totalNursePages}</strong> (<strong>{sortedNurses.length}</strong> total)
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={nursePage === 1}
                                            onClick={() => setNursePage(prev => Math.max(prev - 1, 1))}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={nursePage === totalNursePages}
                                            onClick={() => setNursePage(prev => Math.min(prev + 1, totalNursePages))}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                )}

                {/* 6. PATIENTS DIRECTORY PANEL */}
                {activeTab === 'customers' && (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                                    <Users className="w-8 h-8 text-primary" />
                                    Patients Directory
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">Monitor registered patient profiles, history logs, and access locks.</p>
                            </div>
                            <Button size="sm" onClick={refetchCustomers} className="bg-primary hover:bg-primary/95 text-white">
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin-hover" /> Refetch Patients
                            </Button>
                        </div>

                        {/* Search & Filters Controls */}
                        <Card className="bg-white border-0 shadow-xs">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    {/* Search input */}
                                    <div className="space-y-1 sm:col-span-2">
                                        <Label>Search Patient</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="Search by patient name, email, or mobile..."
                                                className="pl-10"
                                                value={custSearch}
                                                onChange={(e) => {
                                                    setCustSearch(e.target.value)
                                                    setCustPage(1)
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Filter by Status */}
                                    <div className="space-y-1">
                                        <Label>Account Status</Label>
                                        <select
                                            className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                            value={custStatusFilter}
                                            onChange={(e) => {
                                                setCustStatusFilter(e.target.value)
                                                setCustPage(1)
                                            }}
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="Active">Active Accounts</option>
                                            <option value="Blocked">Blocked Accounts</option>
                                        </select>
                                    </div>

                                    {/* Sort By */}
                                    <div className="space-y-1">
                                        <Label>Sort By</Label>
                                        <select
                                            className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                            value={custSortBy}
                                            onChange={(e) => setCustSortBy(e.target.value)}
                                        >
                                            <option value="name">Patient Name</option>
                                            <option value="createdAt">Registration Date</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
                                    {/* Sort Order */}
                                    <div className="space-y-1 col-start-4">
                                        <Label>Sort Order</Label>
                                        <select
                                            className="w-full h-8 rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-hidden"
                                            value={custSortOrder}
                                            onChange={(e) => setCustSortOrder(e.target.value)}
                                        >
                                            <option value="asc">Ascending (A-Z / Old-New)</option>
                                            <option value="desc">Descending (Z-A / New-Old)</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customers Table */}
                        <Card className="bg-white border-0 shadow-xs overflow-hidden">
                            <CardContent className="p-0">
                                {customersLoading ? (
                                    <div className="p-12 text-center text-slate-400">Loading patients directory...</div>
                                ) : paginatedCustomers.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">No patient accounts found matching search/filters.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-100">
                                                    <th className="p-4">Patient Name</th>
                                                    <th className="p-4">Email ID</th>
                                                    <th className="p-4">Mobile Number</th>
                                                    <th className="p-4">Registration Date</th>
                                                    <th className="p-4">Account Status</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm">
                                                {paginatedCustomers.map((cust) => (
                                                    <tr key={cust._id} className="hover:bg-slate-50/50">
                                                        <td className="p-4 font-bold text-slate-800">{cust.name}</td>
                                                        <td className="p-4 text-slate-600">{cust.email}</td>
                                                        <td className="p-4 font-mono text-xs">{cust.mobile || 'N/A'}</td>
                                                        <td className="p-4 text-slate-500">
                                                            {new Date(cust.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                                                day: '2-digit', month: 'short', year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-sm border ${
                                                                cust.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                                {cust.isActive ? 'ACTIVE' : 'BLOCKED'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {cust.isActive ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={async () => {
                                                                            await blockCustomer(cust._id).unwrap()
                                                                            toast.success('Patient locked successfully')
                                                                            refetchCustomers()
                                                                        }}
                                                                        className="text-red-600 hover:bg-red-50 text-xs"
                                                                    >
                                                                        Block
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={async () => {
                                                                            await unblockCustomer(cust._id).unwrap()
                                                                            toast.success('Patient account activated successfully')
                                                                            refetchCustomers()
                                                                        }}
                                                                        className="text-green-600 hover:bg-green-50 text-xs"
                                                                    >
                                                                        Activate
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>

                            {/* Pagination Controls */}
                            {totalCustPages > 1 && (
                                <CardFooter className="bg-slate-50 border-t border-slate-100 flex items-center justify-between p-4">
                                    <span className="text-xs text-slate-500">
                                        Showing page <strong>{custPage}</strong> of <strong>{totalCustPages}</strong> (<strong>{sortedCustomers.length}</strong> total)
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={custPage === 1}
                                            onClick={() => setCustPage(prev => Math.max(prev - 1, 1))}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={custPage === totalCustPages}
                                            onClick={() => setCustPage(prev => Math.min(prev + 1, totalCustPages))}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'milestones' && (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Company Journey</h1>
                                <p className="text-sm text-slate-500 mt-1">Manage the historical growth milestones shown on the About Us page.</p>
                            </div>
                            <Button size="sm" onClick={refetchMilestones} className="bg-primary hover:bg-primary/95 text-white">
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Journey
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Milestone Creator Form */}
                            <Card className="bg-white border-0 shadow-xs lg:col-span-1">
                                <CardHeader className="border-b border-slate-100">
                                    <CardTitle className="text-lg font-bold text-slate-800">Add Milestone</CardTitle>
                                    <CardDescription>Setup new year milestones on the CareNest timeline.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <Label>Milestone Year</Label>
                                            <Input
                                                required
                                                placeholder="e.g. 2027"
                                                value={newMilestone.year}
                                                onChange={(e) => setNewMilestone({ ...newMilestone, year: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Milestone Title</Label>
                                            <Input
                                                required
                                                placeholder="e.g. Expanded to Pune"
                                                value={newMilestone.title}
                                                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Description</Label>
                                            <textarea
                                                required
                                                className="w-full min-h-[90px] p-3 rounded-md border border-input text-xs focus-visible:outline-hidden placeholder-slate-400"
                                                placeholder="Details of what was achieved..."
                                                value={newMilestone.desc}
                                                onChange={(e) => setNewMilestone({ ...newMilestone, desc: e.target.value })}
                                            />
                                        </div>
                                        <Button type="submit" disabled={creatingMilestone} className="w-full bg-primary hover:bg-primary/95 text-white font-bold mt-2">
                                            {creatingMilestone ? 'Adding Milestone...' : 'Add Milestone'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Milestone List */}
                            <Card className="bg-white border-0 shadow-xs lg:col-span-2 overflow-hidden">
                                <CardContent className="p-0">
                                    {milestonesLoading ? (
                                        <div className="p-12 text-center text-slate-400">Loading timeline...</div>
                                    ) : !milestonesData?.result || milestonesData.result.length === 0 ? (
                                        <div className="p-12 text-center text-slate-400">No milestones yet. Create one!</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-100">
                                                        <th className="p-4">Year</th>
                                                        <th className="p-4">Milestone</th>
                                                        <th className="p-4">Description</th>
                                                        <th className="p-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-sm">
                                                    {milestonesData.result.map((m) => (
                                                        <tr key={m._id} className="hover:bg-slate-50/50">
                                                            <td className="p-4 font-bold text-slate-900 font-heading">{m.year}</td>
                                                            <td className="p-4 font-bold text-slate-800">{m.title}</td>
                                                            <td className="p-4 text-slate-500 max-w-[280px] truncate" title={m.desc}>{m.desc}</td>
                                                            <td className="p-4 text-right">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    disabled={deletingMilestone}
                                                                    onClick={() => handleMilestoneDelete(m._id)}
                                                                    className="text-red-600 hover:bg-red-50 text-xs font-semibold"
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'feedbacks' && (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                                    <Star className="w-8 h-8 text-amber-500 fill-amber-500/20" />
                                    Patient Feedbacks & Reviews
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Manage platform reviews, ratings, and toggle which testimonials appear on the public landing page marquee.
                                </p>
                            </div>
                            <Button size="sm" onClick={refetchFeedbacks} className="bg-primary hover:bg-primary/95 text-white">
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Feedbacks
                            </Button>
                        </div>

                        <Card className="bg-white border-0 shadow-xs overflow-hidden">
                            <CardContent className="p-0">
                                {feedbacksLoading ? (
                                    <div className="p-12 text-center text-slate-400">Loading feedbacks...</div>
                                ) : !feedbacksData?.result || feedbacksData.result.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">No patient feedbacks received yet.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-100">
                                                    <th className="p-4">Patient Info</th>
                                                    <th className="p-4">Rating</th>
                                                    <th className="p-4">Review Comment</th>
                                                    <th className="p-4">Date Submitted</th>
                                                    <th className="p-4">Landing Page Status</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm">
                                                {feedbacksData.result.map((feedback) => (
                                                    <tr key={feedback._id} className="hover:bg-slate-50/50">
                                                        <td className="p-4">
                                                            <p className="font-bold text-slate-800">{feedback.name}</p>
                                                            <p className="text-xs text-slate-500">{feedback.email}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((starVal) => (
                                                                    <Star
                                                                        key={starVal}
                                                                        className={`w-4 h-4 ${
                                                                            starVal <= feedback.rating
                                                                                ? 'fill-amber-400 text-amber-400'
                                                                                : 'fill-slate-100 text-slate-200'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 max-w-sm">
                                                            <p className="text-slate-700 whitespace-pre-wrap break-words">{feedback.comment}</p>
                                                        </td>
                                                        <td className="p-4 text-slate-500">
                                                            {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border tracking-wide uppercase ${
                                                                feedback.showInTestimonials
                                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                                    : 'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                                {feedback.showInTestimonials ? 'Visible (Approved)' : 'Hidden'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleFeedbackToggleShow(feedback._id)}
                                                                    className={`text-xs font-semibold flex items-center gap-1 ${
                                                                        feedback.showInTestimonials
                                                                            ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                                            : 'border-primary/20 text-primary hover:bg-purple-50/50'
                                                                    }`}
                                                                >
                                                                    {feedback.showInTestimonials ? (
                                                                        <>
                                                                            <EyeOff className="w-3.5 h-3.5" />
                                                                            Hide
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Eye className="w-3.5 h-3.5" />
                                                                            Show on Home
                                                                        </>
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleFeedbackDelete(feedback._id)}
                                                                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold p-2"
                                                                    title="Delete feedback"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>

            {/* Rejection Feedback Reason Modal */}
            <AnimatePresence>
                {rejectionNurseId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                            onClick={() => setRejectionNurseId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full relative z-10 border border-rose-100"
                        >
                            <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-rose-600" />
                                Reject registration?
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                State clearly why credentials were not verified (e.g. Blur certificate uploads, registration ID mismatch).
                            </p>

                            <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
                                <div className="space-y-1">
                                    <Label>Rejection Feedback</Label>
                                    <textarea
                                        required
                                        className="w-full min-h-[80px] p-3 rounded-md border border-input text-sm focus-visible:outline-hidden"
                                        placeholder="Type reason here..."
                                        value={rejectionFeedback}
                                        onChange={(e) => setRejectionFeedback(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setRejectionNurseId(null)}
                                    >
                                        Cancel Review
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                                    >
                                        Reject Credentials
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Dispatcher Nurse Assignment Selection Modal */}
            <AnimatePresence>
                {dispatchBookingId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                            onClick={() => {
                                setDispatchBookingId(null)
                                setSelectedNurseForBooking('')
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full relative z-10 border border-purple-50"
                        >
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-primary" />
                                Smart Visit Dispatcher
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Querying approved, available nurses within distance that match patient preference.
                            </p>

                            <div className="my-5 space-y-4">
                                {availableLoading ? (
                                    <div className="text-center py-4 space-y-2">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
                                        <p className="text-xs text-slate-400">Searching active caregivers list...</p>
                                    </div>
                                ) : availableNursesData?.result?.length === 0 ? (
                                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                                        <h4 className="font-bold text-sm text-slate-700">No nurses available matching criteria</h4>
                                        <p className="text-[11px] text-slate-500 px-4 mt-0.5">
                                            No verified nurses with GNM/B.Sc matching the patient's gender/date requirement are marked "Available" right now.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                                        {availableNursesData?.result?.map((nurseProfile) => (
                                            <label
                                                key={nurseProfile._id}
                                                className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${selectedNurseForBooking === nurseProfile.nurseId?._id ? 'border-primary bg-purple-50/50' : 'border-slate-100 hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="dispatchNurse"
                                                        value={nurseProfile.nurseId?._id}
                                                        checked={selectedNurseForBooking === nurseProfile.nurseId?._id}
                                                        onChange={() => setSelectedNurseForBooking(nurseProfile.nurseId?._id)}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{nurseProfile.nurseId?.name}</p>
                                                        <p className="text-[11px] text-slate-500">
                                                            Qual: {nurseProfile.qualification} • Exp: {nurseProfile.experienceYear} yr • Gen: {nurseProfile.gender}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-sm">AVAILABLE</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setDispatchBookingId(null)
                                        setSelectedNurseForBooking('')
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleDispatchSubmit}
                                    disabled={!selectedNurseForBooking}
                                    className="bg-primary hover:bg-primary/95 text-white font-bold"
                                >
                                    Assign Caregiver
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminDashboard

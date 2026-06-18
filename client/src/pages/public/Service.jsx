import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetAllServicesQuery } from '@/redux/apis/bookingApi'
import { toast } from 'sonner'
import { 
  ArrowRight,
  IndianRupee, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Stethoscope
} from 'lucide-react'

const Service = () => {
    const navigate = useNavigate()
    const { data: apiServices, isLoading: apiLoading } = useGetAllServicesQuery()
    const patient = useSelector(state => state.auth.patient)
    
    const [selectedService, setSelectedService] = useState(null)

    const displayServices = (apiServices?.result || []).slice(0, 3)

    const handleBookService = (service) => {
        if (!patient) {
            toast.info(`Please login as a patient to proceed with booking ${service.name}.`)
            navigate('/customer/login', { 
                state: { 
                    from: '/customer/dashboard', 
                    selectedServiceId: service._id, 
                    selectedServiceName: service.name 
                } 
            })
        } else {
            navigate('/customer/dashboard', { 
                state: { 
                    selectedServiceId: service._id, 
                    selectedServiceName: service.name 
                } 
            })
        }
    }

    return (
        <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Our Services
                        </h2>
                        <p className="text-muted-foreground">
                            Professional nursing services at your doorstep
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/services')}
                    >
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                {apiLoading ? (
                    <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-6 pb-6 md:pb-0 snap-x snap-mandatory scrollbar-none">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-[290px] sm:w-[350px] md:w-auto flex-shrink-0 snap-start h-72 bg-slate-100 animate-pulse rounded-2xl border border-border/40"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-6 pb-6 md:pb-0 snap-x snap-mandatory scrollbar-none">
                        {displayServices.map((service) => (
                            <div key={service._id} className="w-[290px] sm:w-[350px] md:w-auto flex-shrink-0 snap-start h-full">
                                <Card
                                    className="group cursor-pointer hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 border border-border/60 bg-card/60 backdrop-blur-xs flex flex-col h-full overflow-hidden"
                                    onClick={() => setSelectedService(service)}
                                >
                                    <CardContent className="p-6 flex flex-col h-full flex-1">
                                        {/* Header: Icon & Category */}
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Stethoscope className="w-8 h-8 text-primary" />
                                            </div>
                                            <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                                {service.category}
                                            </Badge>
                                        </div>

                                        {/* Content */}
                                        <h3 className="font-extrabold text-xl text-slate-800 mb-2 group-hover:text-primary transition-colors min-h-[28px] line-clamp-2">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">
                                            {service.description}
                                        </p>

                                        {/* Highlights */}
                                        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 mb-6 space-y-1.5 mt-auto">
                                            <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                                                <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                                                Requires: {service.requiredQualification}
                                            </p>
                                            <p className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                Completed until procedure is finished
                                            </p>
                                        </div>

                                        {/* Footer: Price & More Button */}
                                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Standard Fee</p>
                                                <div className="flex items-center gap-0.5 text-primary">
                                                    <IndianRupee className="w-4 h-4 shrink-0" />
                                                    <span className="text-2xl font-black">{service.price}</span>
                                                    <span className="text-xs text-muted-foreground">/visit</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="group-hover:bg-primary group-hover:text-white border-primary/30 group-hover:border-primary transition-all duration-300 font-bold flex gap-1 items-center text-xs"
                                            >
                                                View Details
                                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Service Detailed Information Overlay Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Glassmorphic Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
                        onClick={() => setSelectedService(null)}
                    />

                    {/* Modal Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Visual Accent Top Bar */}
                        <div className="h-1.5 bg-linear-to-r from-primary via-primary/80 to-secondary shrink-0"></div>

                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4 shrink-0">
                            <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Stethoscope className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-0 mb-1 font-bold text-[10px]">
                                        {selectedService.category.toUpperCase()}
                                    </Badge>
                                    <h2 className="text-2xl font-black text-slate-800 leading-snug">{selectedService.name}</h2>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setSelectedService(null)}
                                className="rounded-full hover:bg-slate-100 shrink-0"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>

                        {/* Modal Scrollable Body */}
                        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
                            
                            {/* Detailed Description */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Service Overview</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedService.description}
                                </p>
                            </div>

                            {/* Quick Spec Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-sm">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Service Bound</span>
                                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>Active until procedure is completed</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Required Caregiver License</span>
                                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                        <Award className="w-4 h-4 text-primary shrink-0" />
                                        <span>{selectedService.requiredQualification}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Sticky Footer Booking Trigger */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Total Session Fee</p>
                                <div className="flex items-center gap-0.5 text-slate-800">
                                    <IndianRupee className="w-5 h-5 shrink-0" />
                                    <span className="text-3xl font-black">{selectedService.price}</span>
                                    <span className="text-sm text-muted-foreground">/visit</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setSelectedService(null)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={() => {
                                        const svc = selectedService
                                        setSelectedService(null)
                                        handleBookService(svc)
                                    }}
                                    className="bg-primary hover:bg-primary/95 text-white font-bold text-sm px-6 py-2 rounded-xl flex gap-2 items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Book This Service
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </section>
    )
}

export default Service
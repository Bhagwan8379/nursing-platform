import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PublicLayout from '@/pages/public/PublicLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetAllServicesQuery } from '@/redux/apis/bookingApi'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  IndianRupee, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Stethoscope
} from 'lucide-react'

const AllServices = () => {
  const navigate = useNavigate()
  const { data: apiServices, isLoading: apiLoading } = useGetAllServicesQuery()
  const patient = useSelector(state => state.auth.patient)
  
  const [selectedService, setSelectedService] = useState(null)

  const displayServices = apiServices?.result || []

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
    <PublicLayout>
      <section className="py-12 px-4 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Back Button */}
          <div className="mb-6 flex justify-start">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              style={{ borderRadius: '9999px' }}
              className="gap-2 hover:bg-purple-100 hover:text-purple-700 text-gray-600 transition-all duration-300 rounded-full border-none text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
              Back
            </Button>
          </div>

          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 px-2.5 py-0.5 text-[11px] border-purple-200 text-purple-700 bg-purple-50">
              <Sparkles className="w-3 h-3 mr-1" />
              Clinical Offerings
            </Badge>
            <h1 className="text-2.5xl md:text-3.25xl font-bold text-gray-900 mb-3 tracking-tight">
              Comprehensive Doorstep Care
            </h1>
            <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              Explore our range of professional, background-verified home healthcare services. Click on any care package below to view complete details, qualifications, and proceed with booking.
            </p>
          </div>

          {/* Catalog Grid */}
          {apiLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-slate-100 animate-pulse rounded-2xl border border-purple-100/30"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((service) => (
                <Card
                  key={service._id}
                  style={{ borderRadius: '1.25rem' }}
                  className="group cursor-pointer hover:shadow-xl hover:border-purple-200/80 hover:-translate-y-1 transition-all duration-300 border border-purple-100/50 bg-white flex flex-col h-full overflow-hidden"
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-5 flex flex-col h-full flex-1">
                    {/* Header: Icon & Category */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Stethoscope className="w-5 h-5 text-purple-600" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100/60 border-0 px-2 py-0.5">
                        {service.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-base text-gray-900 mb-1.5 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-3 leading-relaxed flex-1">
                      {service.description}
                    </p>

                    {/* Highlights */}
                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-[11px] text-gray-500 mb-4 space-y-1 mt-auto">
                      <p className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        Requires: {service.requiredQualification}
                      </p>
                      <p className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Completed until procedure is finished
                      </p>
                    </div>

                    {/* Footer: Price & More Button */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-purple-50/50">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Standard Fee</p>
                        <div className="flex items-center gap-0.5 text-purple-600">
                          <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xl font-bold">{service.price}</span>
                          <span className="text-[11px] text-gray-500 font-medium">/visit</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        style={{ borderRadius: '0.50rem' }}
                        className="group-hover:bg-purple-600 group-hover:text-white border-purple-200 group-hover:border-purple-600 transition-all duration-300 font-semibold flex gap-1 items-center text-[11px] text-purple-700"
                      >
                        View Details
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick FAQ / Features Banner */}
          <div className="mt-16 text-center max-w-2xl mx-auto border-t border-purple-100/30 pt-10">
            <p className="text-xs text-gray-400 leading-relaxed">
              * Rates shown are standard visit package base prices. Long-term post-operative, elder companion care, or round-the-clock intensive care shifts can be custom quoted through our support team at <a href="mailto:support@carenest.com" className="text-purple-600 hover:underline">support@carenest.com</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Service Detailed Information Overlay Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedService(null)}
          />

          {/* Modal Container */}
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Visual Accent Top Bar - Solid Purple */}
            <div className="h-1.5 bg-purple-600 shrink-0"></div>

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4 shrink-0">
              <div className="flex gap-3 items-center">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-0 mb-1 font-semibold text-[9px]">
                    {selectedService.category.toUpperCase()}
                  </Badge>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug">{selectedService.name}</h2>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedService(null)}
                className="rounded-full hover:bg-slate-100 shrink-0"
              >
                <X className="w-4 h-4 text-slate-400" />
              </Button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* Detailed Description */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Service Overview</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {selectedService.description}
                </p>
              </div>

              {/* Quick Spec Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-gray-400 tracking-wider">Service Bound</span>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Active until procedure is completed</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-gray-400 tracking-wider">Required Caregiver License</span>
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{selectedService.requiredQualification}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer Booking Trigger */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Total Session Fee</p>
                <div className="flex items-center gap-0.5 text-gray-900">
                  <IndianRupee className="w-4 h-4 shrink-0" />
                  <span className="text-xl font-bold">{selectedService.price}</span>
                  <span className="text-[11px] text-gray-400 font-medium">/visit</span>
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
                  style={{ borderRadius: '0.75rem' }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-2 rounded-xl flex gap-2 items-center shadow-lg border-none hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Book This Service
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </PublicLayout>
  )
}

export default AllServices
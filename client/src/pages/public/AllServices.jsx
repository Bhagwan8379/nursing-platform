import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PublicLayout from '@/pages/public/PublicLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetAllServicesQuery } from '@/redux/apis/bookingApi'
import { toast } from 'sonner'
import {
  ArrowLeft,
  IndianRupee,
  Award,
  CheckCircle2,
  ChevronRight,
  X,
  Stethoscope,
  ArrowRight,
  Shield
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
      {/* ─── HERO HEADER ──────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 60%, #fff 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[400px] opacity-[0.07] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-purple-100 hover:text-purple-700 text-gray-500 transition-all duration-300 rounded-full text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 text-purple-500" />
              Back
            </Button>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            {/* Trust row */}
            <div className="flex flex-wrap justify-center gap-6 mt-2">
              {[
                { icon: <Shield className="w-3.5 h-3.5 text-purple-500" />, text: 'All Nurses Verified' },
                { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, text: 'Background Checked' },
                { icon: <Award className="w-3.5 h-3.5 text-amber-500" />, text: 'Licensed Professionals' },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  {t.icon}
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES CATALOG ─────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {apiLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((service, idx) => (
                <div
                  key={service._id}
                  onClick={() => setSelectedService(service)}
                  className="group cursor-pointer bg-white border border-gray-100 rounded-2xl p-6 flex flex-col hover:border-purple-200 hover:-translate-y-1.5 transition-all duration-400"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(147,51,234,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)', boxShadow: '0 2px 8px rgba(147,51,234,0.1)' }}
                    >
                      <Stethoscope className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {service.category}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2 font-heading">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-5 line-clamp-3 leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Info strip */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-gray-500 mb-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                      <Award className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      Requires: {service.requiredQualification}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      Completed until procedure is finished
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Standard Fee</p>
                      <div className="flex items-baseline gap-0.5 text-purple-600">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span className="text-xl font-black">{service.price}</span>
                        <span className="text-xs text-gray-400 font-medium">/visit</span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-2 rounded-xl group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
                    >
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-14 text-center max-w-2xl mx-auto pt-10 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              * Rates shown are standard visit package base prices. Long-term post-operative, elder companion care, or round-the-clock intensive care shifts can be custom quoted through our support team at{' '}
              <a href="mailto:support@carenest.com" className="text-purple-600 hover:underline font-semibold">support@carenest.com</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SERVICE DETAIL MODAL ─────────────── */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 backdrop-blur-sm transition-opacity duration-300"
            style={{ background: 'rgba(10,5,30,0.6)' }}
            onClick={() => setSelectedService(null)}
          />

          {/* Modal */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-[95%] sm:w-full max-h-[90vh] overflow-y-auto relative z-10 border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Top accent bar */}
            <div className="h-1.5 rounded-t-3xl shrink-0" style={{ background: 'linear-gradient(90deg, #9333ea, #7c3aed)' }} />

            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-start gap-3 shrink-0">
              <div className="flex gap-3 items-center">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)' }}>
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wide inline-block mb-1">
                    {selectedService.category}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 font-heading">{selectedService.name}</h2>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedService(null)}
                className="rounded-full hover:bg-gray-100 shrink-0 w-8 h-8"
              >
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Service Overview</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{selectedService.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Service Bound</span>
                  <div className="flex items-center gap-2 font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Active until procedure is completed</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Required Caregiver License</span>
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{selectedService.requiredQualification}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Total Session Fee</p>
                <div className="flex items-baseline justify-center sm:justify-start gap-0.5 text-gray-900">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-2xl font-black">{selectedService.price}</span>
                  <span className="text-xs text-gray-400 font-medium">/visit</span>
                </div>
              </div>
              <div className="flex w-full sm:w-auto gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 sm:flex-initial rounded-xl border-gray-200 text-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const svc = selectedService
                    setSelectedService(null)
                    handleBookService(svc)
                  }}
                  className="flex-1 sm:flex-initial text-white font-bold px-6 rounded-xl border-none gap-2 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 4px 14px rgba(147,51,234,0.35)' }}
                >
                  Book This Service
                  <ArrowRight className="w-4 h-4" />
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
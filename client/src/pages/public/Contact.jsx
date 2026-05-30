import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowLeft
} from 'lucide-react'

const Contact = () => {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields (*)')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Thank you! Your message has been sent successfully. A care coordinator will contact you shortly.')
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      })
    }, 1500)
  }

  const contactInfos = [
    {
      icon: <Phone className="w-4 h-4 text-purple-600" />,
      title: 'Call or Text Us',
      detail1: '+1 (800) 555-CARE',
      detail2: 'Urgent care support available 24/7.',
      actionUrl: 'tel:+18005552273'
    },
    {
      icon: <Mail className="w-4 h-4 text-purple-600" />,
      title: 'Email Support',
      detail1: 'support@carenest.com',
      detail2: 'Response within 2 coordinators-hours.',
      actionUrl: 'mailto:support@carenest.com'
    },
    {
      icon: <MapPin className="w-4 h-4 text-purple-600" />,
      title: 'Headquarters Office',
      detail1: 'Suite 400, Medical Care Blvd',
      detail2: 'New York, NY 10001',
      actionUrl: 'https://maps.google.com'
    },
    {
      icon: <Clock className="w-4 h-4 text-purple-600" />,
      title: 'Operating Hours',
      detail1: '24/7 Support Desk',
      detail2: 'Nurse Matchmaking: 8 AM - 10 PM EST',
      actionUrl: '#'
    }
  ]

  const faqs = [
    {
      q: 'How do you verify the credentials of the nurses?',
      a: 'Every nurse on CareNest goes through a comprehensive multi-step vetting process. We verify active nursing licenses directly with State Boards of Nursing, perform criminal background checks, verify clinical references, and conduct interview checks to ensure the highest standards of safety and professionalism.'
    },
    {
      q: 'Can I book a nurse for emergency/immediate assistance?',
      a: 'Yes. Our Care Coordination team operates 24/7. When you register and request an urgent home care booking, our automated matchmaking systems identify available certified caregivers within your immediate geographical radius, matching you within hours.'
    },
    {
      q: 'How is payment handled on CareNest?',
      a: 'All booking payments are handled securely through our integrated digital payment gateway. Clients are billed transparently with hourly rates calculated up-front. Nurses receive direct automatic transfers upon successful validation and completion of their designated shifts.'
    },
    {
      q: 'What if I want to change or replace my matched nurse?',
      a: 'Your peace of mind is paramount. If you or your family member feels that the matched nurse is not the absolute best fit for your emotional or clinical requirements, you can request a replacement immediately through your Patient Dashboard or by calling our support line.'
    },
    {
      q: 'Do you accept health insurance plans?',
      a: 'While CareNest operates on a direct private pay basis to keep services highly accessible and immediate, we provide fully detailed medical invoices, itemized receipts, and clinical reports so you can submit them to your insurance provider or Health Savings Account (HSA/FSA) for reimbursement.'
    }
  ]

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <PublicLayout>
      {/* Hero Header - Compact & Solid */}
      <section className="bg-slate-50 py-8 px-4 border-b border-purple-100/30">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-4 flex justify-start">
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

          <div className={`max-w-3xl mx-auto transition-all duration-1000 ease-out transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-center">
              <Badge className="mb-2 bg-purple-100 text-purple-700 hover:bg-purple-100 border-none animate-fade-in text-[10px]" variant="secondary">
                💬 Contact CareNest Support
              </Badge>
              <h1 className="text-2.25xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                We are Always Here for You
              </h1>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                Whether you are ready to book a private nurse, need assistance with your dashboard, or simply have questions about clinical safety, our team is standing by to assist you 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info & Form Section - Sleek & Compact */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Consolidated Directory & Map Info */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Directory Card */}
              <div 
                style={{ borderRadius: '1.25rem' }}
                className="bg-slate-50 border border-purple-100/50 p-5 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.03)]"
              >
                <div className="mb-4">
                  <Badge variant="outline" className="mb-1.5 bg-white text-purple-700 border-purple-200 text-[9px] px-2 py-0.5">Info Directory</Badge>
                  <h2 className="text-base font-semibold text-gray-900">How Can We Connect?</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Select the channel that is most convenient for you.</p>
                </div>

                <div className="space-y-3.5">
                  {contactInfos.map((info, idx) => (
                    <div key={idx} className="flex gap-3 group items-start border-b border-purple-50/50 pb-3 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-purple-100/60 flex items-center justify-center shrink-0 mt-0.5 shadow-inner transition-colors group-hover:bg-purple-50">
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-xs">{info.title}</h3>
                        <p className="text-[11px] font-semibold text-purple-700 mt-0.5">{info.detail1}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{info.detail2}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Map Card */}
              <div 
                style={{ borderRadius: '1.25rem' }}
                className="p-4 bg-slate-50 border border-purple-100/50 shadow-[0_4px_15px_-4px_rgba(168,85,247,0.02)] overflow-hidden relative"
              >
                <div className="relative z-10 flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-4.5 h-4.5 text-purple-600 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">Global Coverage, Local Care</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mt-0.5">
                      Check real-time nurse availability near you from your patient portal.
                    </p>
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-0 flex gap-1 items-center w-fit mt-1.5 px-2 py-0.5 text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Nurses active near you now
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form Card - Trimmed Height */}
            <div className="lg:col-span-7">
              <Card style={{ borderRadius: '1.25rem' }} className="shadow-lg border-purple-100/50 overflow-hidden h-fit">
                <CardContent className="p-5 md:p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-1.5 text-purple-700 border-purple-200 text-[9px] px-2 py-0.5">Inquiry Form</Badge>
                    <h2 className="text-base font-semibold text-gray-900">Send Us a Direct Message</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">We respond to every submission within 2 working hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-600 flex gap-0.5">
                          Full Name <span className="text-destructive">*</span>
                        </label>
                        <Input 
                          type="text" 
                          name="name" 
                          placeholder="Jane Doe" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '0.5rem' }}
                          className="h-9.5 text-xs border-purple-100"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-600 flex gap-0.5">
                          Email Address <span className="text-destructive">*</span>
                        </label>
                        <Input 
                          type="email" 
                          name="email" 
                          placeholder="jane@example.com" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          style={{ borderRadius: '0.5rem' }}
                          className="h-9.5 text-xs border-purple-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-600">
                          Phone Number
                        </label>
                        <Input 
                          type="tel" 
                          name="phone" 
                          placeholder="+1 (555) 019-2834" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          style={{ borderRadius: '0.5rem' }}
                          className="h-9.5 text-xs border-purple-100"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-600">
                          Subject Topic
                        </label>
                        <select 
                          name="subject" 
                          value={formData.subject}
                          onChange={handleInputChange}
                          style={{ borderRadius: '0.5rem' }}
                          className="w-full h-9.5 rounded-lg border border-purple-100 bg-background px-3 py-1.5 text-xs outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Billing & Pricing">Billing & Pricing</option>
                          <option value="Nurse Matching">Nurse Matching Assistance</option>
                          <option value="Join Network">Join Nurse Network</option>
                          <option value="Technical Feedback">Technical Feedback / Issue</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-600 flex gap-0.5">
                        Your Detailed Message <span className="text-destructive">*</span>
                      </label>
                      <textarea 
                        name="message" 
                        rows="3.5"
                        placeholder="Please write the details of your inquiry here..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        style={{ borderRadius: '0.5rem' }}
                        className="w-full rounded-lg border border-purple-100 bg-transparent px-3 py-2 text-xs outline-none transition-all placeholder:text-gray-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                      ></textarea>
                    </div>

                    <Button 
                      type="submit" 
                      style={{ borderRadius: '0.5rem' }}
                      className="w-full h-9.5 mt-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 font-bold text-xs shadow-md border-none transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sending your inquiry...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion Section - Sleek & Solid */}
      <section className="py-12 px-4 bg-slate-50 border-t border-purple-100/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full inline-block mb-2">FAQ</span>
            <h2 className="text-xl md:text-2.5xl font-bold text-gray-900 mb-2 tracking-tight">
              Frequently Answered Questions
            </h2>
            <p className="text-gray-400 max-w-xs mx-auto text-xs">
              Quick answers to the most common queries about booking, vetting, and matching.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div 
                  key={idx} 
                  style={{ borderRadius: '0.75rem' }}
                  className="bg-white border border-purple-100/50 shadow-[0_2px_10px_-4px_rgba(168,85,247,0.02)] overflow-hidden transition-all duration-300"
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3.5 flex items-center justify-between text-left font-semibold text-gray-900 text-xs hover:bg-purple-50/30 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-xs">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-0.5 text-[11px] text-gray-500 leading-relaxed border-t border-purple-50/50 bg-slate-50/30 animate-in fade-in slide-in-from-top-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default Contact

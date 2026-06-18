import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Button } from '@/components/ui/button'
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
  ArrowLeft,
  CheckCircle2
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
  const faqRef = useRef(null)
  const [faqVisible, setFaqVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFaqVisible(true) }, { threshold: 0.1 })
    if (faqRef.current) obs.observe(faqRef.current)
    return () => obs.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      toast.success('Thank you! Your message has been sent. A care coordinator will contact you shortly.')
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
    }, 1500)
  }

  const contactInfos = [
    {
      icon: <Phone className="w-4 h-4 text-purple-600" />,
      title: 'Call or Text Us',
      detail1: '+91 98765 43210',
      detail2: 'Urgent care support available 24/7.',
      actionUrl: 'tel:+919876543210',
      color: 'from-purple-50 to-purple-100/60'
    },
    {
      icon: <Mail className="w-4 h-4 text-blue-600" />,
      title: 'Email Support',
      detail1: 'care@carenest.in',
      detail2: 'Response within 2 business hours.',
      actionUrl: 'mailto:care@carenest.in',
      color: 'from-blue-50 to-blue-100/60'
    },
    {
      icon: <MapPin className="w-4 h-4 text-emerald-600" />,
      title: 'Headquarters',
      detail1: 'Aurangabad, Maharashtra',
      detail2: 'Serving all of Maharashtra.',
      actionUrl: 'https://maps.google.com',
      color: 'from-emerald-50 to-emerald-100/60'
    },
    {
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      title: 'Operating Hours',
      detail1: '24/7 Support Desk',
      detail2: 'Nurse Matchmaking: 8 AM–10 PM IST',
      actionUrl: '#',
      color: 'from-amber-50 to-amber-100/60'
    },
  ]

  const faqs = [
    {
      q: 'How do you verify the credentials of the nurses?',
      a: 'Every nurse on CareNest goes through a comprehensive multi-step vetting process. We verify active nursing licenses, perform criminal background checks, verify clinical references, and conduct interview checks to ensure the highest standards of safety and professionalism.'
    },
    {
      q: 'Can I book a nurse for emergency/immediate assistance?',
      a: 'Yes. Our Care Coordination team operates 24/7. When you register and request an urgent home care booking, our automated matchmaking systems identify available certified caregivers within your immediate geographical radius, matching you within hours.'
    },
    {
      q: 'How is payment handled on CareNest?',
      a: 'All booking payments are handled securely through our integrated digital payment gateway. Clients are billed transparently with rates calculated up-front. Nurses receive direct automatic transfers upon successful completion of their designated shifts.'
    },
    {
      q: 'What if I want to change or replace my matched nurse?',
      a: 'Your peace of mind is paramount. If you or your family member feels that the matched nurse is not the best fit, you can request a replacement immediately through your Patient Dashboard or by calling our support line.'
    },
    {
      q: 'Do you accept health insurance plans?',
      a: 'While CareNest operates on a direct private pay basis, we provide fully detailed medical invoices, itemized receipts, and clinical reports so you can submit them to your insurance provider or Health Savings Account (HSA/FSA) for reimbursement.'
    },
  ]

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <PublicLayout>

      {/* ─── HERO HEADER ──────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-6 px-4" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 60%, #fff 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[400px] opacity-[0.07] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-6xl mx-auto">
          <div className="mb-2">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-purple-100 hover:text-purple-700 text-gray-500 transition-all duration-300 rounded-full text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 text-purple-500" />
              Back
            </Button>
          </div>
        </div>
      </section>

      {/* ─── CONTACT INFO CARDS ────────────────── */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfos.map((info, idx) => (
              <a
                key={idx}
                href={info.actionUrl}
                className={`group bg-gradient-to-br ${info.color} border border-gray-100 rounded-2xl p-5 hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 block`}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                onClick={info.actionUrl === '#' ? (e) => e.preventDefault() : undefined}
              >
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{info.title}</h3>
                <p className="text-xs font-semibold text-purple-700 mb-0.5">{info.detail1}</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">{info.detail2}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FORM + INFO SECTION ────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left: Additional info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight font-heading">
                  Get in Touch
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Whether you're a patient looking for care or a nurse wanting to join our network, we're here to help you every step of the way.
                </p>
              </div>

              {/* Trust points */}
              <div className="space-y-3">
                {[
                  'We respond to every inquiry within 2 hours',
                  'Our team is available 24/7 for urgent care',
                  'All conversations are strictly confidential',
                  'Direct line to our care coordinators',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 font-medium">{point}</span>
                  </div>
                ))}
              </div>

              {/* Active status badge */}
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-700">Nurses Active Near You</span>
                  </div>
                  <p className="text-[11px] text-emerald-600">Check real-time availability from your patient portal</p>
                </div>
              </div>

              {/* Operating hours */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Response Times</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Phone & Urgent Care', time: 'Under 15 min' },
                    { label: 'Email Support', time: '1–2 hours' },
                    { label: 'Nurse Matchmaking', time: 'Under 3 hours' },
                  ].map(({ label, time }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">{label}</span>
                      <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px -8px rgba(147,51,234,0.1), 0 2px 12px rgba(0,0,0,0.04)' }}>


                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex gap-0.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-10 text-sm border-gray-200 focus:border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex gap-0.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-10 text-sm border-gray-200 focus:border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-10 text-sm border-gray-200 focus:border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Subject Topic</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full h-10 rounded-xl border border-gray-200 bg-background px-3 text-sm outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
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
                    <label className="text-xs font-bold text-gray-700 flex gap-0.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Please write the details of your inquiry here..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-white font-bold text-sm rounded-xl border-none gap-2 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 4px 16px rgba(147,51,234,0.35)' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending your inquiry...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ──────────────────────── */}
      <section ref={faqRef} className="py-20 px-4 border-t border-gray-100" style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f3ff 50%, #fafafa 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full inline-block mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
              Quick answers to the most common queries about booking, vetting, and matching.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-200"
                  style={{
                    boxShadow: isOpen ? '0 8px 24px -6px rgba(147,51,234,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                    transitionDelay: faqVisible ? `${idx * 80}ms` : '0ms',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between text-left transition-colors hover:bg-purple-50/30"
                  >
                    <span className="flex items-center gap-3 text-sm font-bold text-gray-900 pr-4">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)' }}>
                        <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      {faq.q}
                    </span>
                    <div className="shrink-0 w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center bg-gray-50">
                      {isOpen
                        ? <ChevronUp className="w-3.5 h-3.5 text-purple-600" />
                        : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      }
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-sm text-gray-500 leading-relaxed border-t border-purple-50 bg-purple-50/20 animate-in fade-in slide-in-from-top-1">
                      <div className="pt-4">{faq.a}</div>
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

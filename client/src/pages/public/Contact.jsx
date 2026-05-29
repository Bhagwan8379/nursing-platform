import React, { useState } from 'react'
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
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  HelpCircleIcon
} from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields (*)')
      return
    }

    setIsSubmitting(true)

    // Simulate backend submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Thank you! Your message has been sent successfully. A care coordinator will contact you shortly.')
      
      // Reset form
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
      icon: <Phone className="w-5 h-5 text-primary" />,
      title: 'Call or Text Us',
      detail1: '+1 (800) 555-CARE',
      detail2: 'Toll-free, available 24/7 for urgent care bookings.',
      actionLabel: 'Call Now',
      actionUrl: 'tel:+18005552273'
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: 'Email Communications',
      detail1: 'support@carenest.com',
      detail2: 'Expect a response from our medical coordinators within 2 hours.',
      actionLabel: 'Send Email',
      actionUrl: 'mailto:support@carenest.com'
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: 'Headquarters Office',
      detail1: 'Suite 400, Medical Care Blvd',
      detail2: 'New York, NY 10001',
      actionLabel: 'Get Directions',
      actionUrl: 'https://maps.google.com'
    },
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: 'Operating Hours',
      detail1: 'Care Coordinators: 24/7 Available',
      detail2: 'Nurse Matchmaking: Daily 8:00 AM - 10:00 PM EST',
      actionLabel: 'Book Consultation',
      actionUrl: '#book'
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
      {/* Hero Header */}
      <section className="bg-linear-to-br from-primary/20 via-background to-secondary/10 py-16 px-4 text-center border-b border-border/50">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            💬 Contact CareNest Support
          </Badge>
          <h1 className="text-4xl font-extrabold text-foreground leading-tight mb-4">
            We are Always Here for You
          </h1>
          <p className="text-muted-foreground text-md md:text-lg leading-relaxed max-w-xl mx-auto">
            Whether you are ready to book a private nurse, need assistance with your dashboard, or simply have questions about clinical safety, our team is standing by to assist you 24/7.
          </p>
        </div>
      </section>

      {/* Info & Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="mb-6">
                <Badge variant="outline" className="mb-2">Info Center</Badge>
                <h2 className="text-2xl font-bold text-foreground">How Can We Connect?</h2>
                <p className="text-sm text-muted-foreground mt-1">Select the channel that is most convenient for you.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactInfos.map((info, idx) => (
                  <div key={idx} className="p-5 bg-background rounded-xl border border-border/50 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-300 flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-sm">{info.title}</h3>
                      <p className="text-sm font-semibold text-primary mt-1">{info.detail1}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{info.detail2}</p>
                      <a 
                        href={info.actionUrl} 
                        className="inline-block mt-3 text-xs font-semibold text-primary hover:underline"
                        onClick={(e) => {
                          if (info.actionUrl.startsWith('#')) e.preventDefault();
                        }}
                      >
                        {info.actionLabel} &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder Graphic */}
              <div className="p-6 bg-linear-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border border-border/60 shadow-xs overflow-hidden relative group">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/20"></div>
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-primary animate-bounce" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Global Coverage, Local Care</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mb-3">
                    Our verified nurses are distributed across the country. Check real-time nurse availability near you from your patient portal.
                  </p>
                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-0 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Nurses active near you now
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form Card */}
            <div className="lg:col-span-7">
              <Card className="shadow-xl border-primary/10 relative overflow-hidden h-fit">
                {/* Visual Accent Top Bar */}
                <div className="h-1.5 bg-linear-to-r from-primary via-primary/80 to-secondary"></div>
                <CardContent className="p-6 md:p-10">
                  <div className="mb-8">
                    <Badge variant="outline" className="mb-2">Inquiry Form</Badge>
                    <h2 className="text-2xl font-bold text-foreground">Send Us a Direct Message</h2>
                    <p className="text-sm text-muted-foreground mt-1">We respond to every submission within 2 working hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex gap-0.5">
                          Full Name <span className="text-destructive">*</span>
                        </label>
                        <Input 
                          type="text" 
                          name="name" 
                          placeholder="Jane Doe" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex gap-0.5">
                          Email Address <span className="text-destructive">*</span>
                        </label>
                        <Input 
                          type="email" 
                          name="email" 
                          placeholder="jane@example.com" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Phone Number (Optional)
                        </label>
                        <Input 
                          type="tel" 
                          name="phone" 
                          placeholder="+1 (555) 019-2834" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Subject Topic
                        </label>
                        <select 
                          name="subject" 
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none transition-all focus:border-ring focus:ring-3 focus:ring-ring/50"
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
                      <label className="text-xs font-semibold text-foreground flex gap-0.5">
                        Your Detailed Message <span className="text-destructive">*</span>
                      </label>
                      <textarea 
                        name="message" 
                        rows="5"
                        placeholder="Please write the details of your inquiry here..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30"
                      ></textarea>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-10 mt-2 bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all duration-300"
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
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion Section */}
      <section className="py-20 px-4 bg-muted/20 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3" variant="outline">FAQ</Badge>
            <h2 className="text-3xl font-extrabold text-foreground mb-4">
              Frequently Answered Questions
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Quick answers to the most common queries about booking, vetting, and matching.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div 
                  key={idx} 
                  className="bg-background rounded-xl border border-border/50 shadow-xs overflow-hidden transition-all duration-300"
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-bold text-foreground text-md hover:bg-muted/10 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/20 bg-muted/5 animate-in fade-in slide-in-from-top-1">
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

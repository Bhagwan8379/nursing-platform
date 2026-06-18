import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  FileText,
  UserCheck,
  HeartHandshake,
  CreditCard,
  AlertTriangle,
  Scale,
  Building,
  Mail
} from 'lucide-react'

const Terms = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('intro')

  const sections = [
    { id: 'intro', label: '1. Acceptance of Terms', icon: FileText },
    { id: 'accounts', label: '2. User Accounts', icon: UserCheck },
    { id: 'services', label: '3. Matchmaking & Care', icon: HeartHandshake },
    { id: 'billing', label: '4. Fees & Cancellations', icon: CreditCard },
    { id: 'conduct', label: '5. Rules of Conduct', icon: AlertTriangle },
    { id: 'liability', label: '6. Limitation of Liability', icon: Scale },
    { id: 'governing', label: '7. Governing Law', icon: Building },
    { id: 'contact', label: '8. Legal Contact', icon: Mail }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: 'smooth'
      })
      setActiveSection(id)
    }
  }

  return (
    <PublicLayout>
      <div className="relative min-h-screen bg-slate-50/50 pb-24">
        {/* Background design elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.05] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur-80px)' }} />
        <div className="absolute top-[400px] left-0 w-[400px] h-[400px] opacity-[0.03] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)', filter: 'blur-60px)' }} />

        {/* Top Header */}
        <div className="bg-white border-b border-purple-100/60 pt-8 pb-10 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="gap-2 hover:bg-purple-50 hover:text-purple-700 text-gray-500 transition-all duration-300 rounded-full text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 text-purple-500" />
                Back
              </Button>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3 font-heading">
                Terms of Service
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Last updated: June 18, 2026. Please read these Terms of Service carefully. These Terms govern your access to and use of the CareNest platform and services.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Navigation Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                  Table of Contents
                </h2>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600 pl-2'
                            : 'text-gray-500 hover:bg-slate-50 hover:text-gray-900 border-l-4 border-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                        {section.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Quick Legal Help Card */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-[0_8px_30px_rgba(124,58,237,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative z-10">
                  <h3 className="font-bold text-sm mb-2 font-heading">Legal Questions?</h3>
                  <p className="text-xs text-purple-200 leading-relaxed mb-4">
                    Require clarification on registration requirements, nurse responsibilities, or liability terms?
                  </p>
                  <Button
                    onClick={() => navigate('/contact')}
                    size="sm"
                    className="w-full bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-xl border-none transition-all duration-300"
                  >
                    Contact Legal Desk
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Content */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-12">
              
              {/* Section 1: Acceptance of Terms */}
              <section id="intro" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    1. Acceptance of Terms
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    By downloading, accessing, or using the <strong>CareNest</strong> web applications and related services, you ("User", "Customer", "Patient", or "Nurse") agree to be bound by these Terms of Service ("Terms") and our associated Privacy Policy.
                  </p>
                  <p>
                    If you do not agree with any part of these Terms, you must immediately cease all interactions with our platform.
                  </p>
                  <p>
                    We reserve the right to alter, edit, or update these terms at any time. When modifications occur, we will adjust the "Last updated" date above. Your continued participation on the platform represents consent to the revised Terms.
                  </p>
                </div>
              </section>

              {/* Section 2: User Accounts */}
              <section id="accounts" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    2. Accounts, Security & Verification
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    To request home care visits or list yourself as a nurse on CareNest, you must register a secure account:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li><strong>Account Security:</strong> You are solely responsible for maintaining the privacy of your registration password and profile details.</li>
                    <li><strong>Accuracy:</strong> All profiles must contain accurate, up-to-date names, addresses, and contacts. Providing fraudulent credentials or fake identities is ground for immediate termination.</li>
                    <li><strong>Nurse Verifications:</strong> Nurses registering on the platform must submit authentic nursing licenses, registration certifications, and undergo background checks. CareNest reserves the right to decline or suspend nurse accounts that fail verification audits.</li>
                  </ul>
                </div>
              </section>

              {/* Section 3: Matchmaking & Care */}
              <section id="services" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <HeartHandshake className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    3. Matchmaking & Role of CareNest
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    It is crucial to understand the service architecture of our platform:
                  </p>
                  <p>
                    <strong>CareNest is a digital platform connecting patients with independent, licensed professional nurses.</strong> CareNest acts as a mediator for scheduling, credential verification, and booking management.
                  </p>
                  <p>
                    The nurses offering services on this platform are independent healthcare professionals. While we audit licenses and perform verification, the specific clinical treatment, medication administration, and care execution during a visit are the direct professional responsibility of the matched nurse.
                  </p>
                </div>
              </section>

              {/* Section 4: Fees & Cancellations */}
              <section id="billing" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    4. Fees, Bookings & Cancellation Policies
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    By scheduling a home nurse visit, you agree to the payment parameters established for the specific service:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li><strong>Service Fees:</strong> Booking fees are determined based on the selected service category (e.g., General Nursing, Elder Care, Critical Care) and visit duration.</li>
                    <li><strong>Payment Gateways:</strong> Payments must be processed through CareNest's secure digital billing portal. Cash handling with nurses is strictly prohibited unless specifically outlined in custom contracts.</li>
                    <li><strong>Cancellations:</strong> If you cancel a confirmed booking, a cancellation fee may apply depending on how close the cancellation is to the scheduled visit.</li>
                    <li><strong>Refunds:</strong> Refund requests for missed visits or disputes must be submitted to Support within 48 hours of the scheduled time.</li>
                  </ul>
                </div>
              </section>

              {/* Section 5: Rules of Conduct */}
              <section id="conduct" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    5. Rules of Conduct
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    To ensure safe, dignified clinical visits in private homes, all users must respect our conduct rules:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li><strong>Safe Environment:</strong> Patients must ensure their home environment is clean, secure, and respectful for the visiting caregiver.</li>
                    <li><strong>Professional Respect:</strong> Verbal abuse, physical aggression, or harassment of nurses will result in an immediate permanent ban from CareNest and reporting to local authorities.</li>
                    <li><strong>Integrity:</strong> Soliciting nurses for private services outside the platform violates standard agreements.</li>
                  </ul>
                </div>
              </section>

              {/* Section 6: Limitation of Liability */}
              <section id="liability" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    6. Disclaimer & Limitation of Liability
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    <strong>The CareNest platform is provided on an "as is" and "as available" basis.</strong>
                  </p>
                  <p>
                    To the maximum extent permitted by applicable law, CareNest, its founders, and employees will not be held liable for:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li>Any clinical errors, malpractice, or injury caused during visits by matched independent nurses.</li>
                    <li>Indirect, incidental, or consequential damages resulting from platform scheduling delays, app downtime, or mismatch of nurse availability.</li>
                    <li>Losses arising from unauthorized data access if patient credentials were compromised due to user negligence.</li>
                  </ul>
                </div>
              </section>

              {/* Section 7: Governing Law */}
              <section id="governing" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <Building className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    7. Governing Law & Jurisdiction
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    These Terms of Service and any operating rules established by CareNest are governed and construed in accordance with the laws of India.
                  </p>
                  <p>
                    Any disputes, arguments, or legal proceedings relating to your use of this platform shall be resolved within courts of competent jurisdiction located in <strong>Aurangabad, Maharashtra, India</strong>.
                  </p>
                </div>
              </section>

              {/* Section 8: Legal Contact */}
              <section id="contact" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    8. Legal Queries & Reports
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                  <p className="mb-4">
                    For legal notices or reports regarding terms violation, contact our Legal team:
                  </p>
                  <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 text-sm space-y-2 max-w-md">
                    <p className="font-bold text-gray-900">CareNest Legal & Compliance</p>
                    <p className="text-gray-600">Email: <a href="mailto:legal@carenest.in" className="text-purple-600 hover:underline font-semibold">legal@carenest.in</a></p>
                    <p className="text-gray-600">Address: Aurangabad, Maharashtra, India</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Terms

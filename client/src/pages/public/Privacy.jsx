import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ShieldCheck,
  Eye,
  Lock,
  UserCheck,
  Server,
  FileText,
  Mail,
  Scale
} from 'lucide-react'

const Privacy = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('intro')

  const sections = [
    { id: 'intro', label: '1. Introduction', icon: ShieldCheck },
    { id: 'collect', label: '2. Information We Collect', icon: Eye },
    { id: 'use', label: '3. How We Use Data', icon: UserCheck },
    { id: 'share', label: '4. Information Sharing', icon: Scale },
    { id: 'security', label: '5. Medical Data Security', icon: Lock },
    { id: 'rights', label: '6. Your Rights', icon: FileText },
    { id: 'contact', label: '7. Contact Info', icon: Mail }
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

        {/* Top Header / Hero */}
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
                Privacy Policy
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Last updated: June 18, 2026. Please read this Privacy Policy carefully to understand how CareNest collects, protects, and uses your personal and medical information.
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

              {/* Quick Help Card */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-[0_8px_30px_rgba(124,58,237,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative z-10">
                  <h3 className="font-bold text-sm mb-2 font-heading">Need Privacy Help?</h3>
                  <p className="text-xs text-purple-200 leading-relaxed mb-4">
                    Have questions about how your medical data is handled or want to request account deletion?
                  </p>
                  <Button
                    onClick={() => navigate('/contact')}
                    size="sm"
                    className="w-full bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-xl border-none transition-all duration-300"
                  >
                    Contact DPO Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Content */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-12">
              
              {/* Section 1: Introduction */}
              <section id="intro" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    1. Introduction & Overview
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    Welcome to <strong>CareNest</strong>. Your privacy and the confidentiality of your personal and health-related data are extremely important to us.
                  </p>
                  <p>
                    This Privacy Policy outlines how we collect, store, share, and safeguard information when you use our home healthcare booking platform (including our website, services, and applications). By accessing our services, you consent to the practices described in this document.
                  </p>
                  <p>
                    We strictly comply with applicable healthcare and digital privacy regulations. Our target is to ensure that matching patients with private duty nurses remains completely secure, encrypted, and governed by consent.
                  </p>
                </div>
              </section>

              {/* Section 2: Information We Collect */}
              <section id="collect" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    2. Information We Collect
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                  <p>
                    To deliver reliable clinical matchmaking and maintain safety, we collect several categories of information:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-1.5">For Patients & Customers</h4>
                      <ul className="text-xs space-y-1.5 text-gray-500 list-disc list-inside">
                        <li>Account Profile (Name, Phone, Email, Address)</li>
                        <li>Health Assessments & Medical History</li>
                        <li>Booking Logs & Nurse Requirements</li>
                        <li>Billing/Transaction History (via secure gateways)</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-1.5">For Licensed Nurses</h4>
                      <ul className="text-xs space-y-1.5 text-gray-500 list-disc list-inside">
                        <li>Professional Credentials & Registrations</li>
                        <li>Government Identity Documents & Background Audits</li>
                        <li>Geographical Availability & Work Logs</li>
                        <li>Ratings, Feedback, and Performance Metrics</li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    Additionally, when visiting our platform, we automatically collect basic technical parameters such as IP addresses, browser types, session durations, and cookie preferences.
                  </p>
                </div>
              </section>

              {/* Section 3: How We Use Data */}
              <section id="use" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    3. How We Use Your Data
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    CareNest processes your information strictly for legitimate operational purposes:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li><strong>Service Matchmaking:</strong> Matching patient requirements with verified, nearby nurses.</li>
                    <li><strong>Account Administration:</strong> Setting up customer portals, tracking booking requests, and managing nurse profiles.</li>
                    <li><strong>Verification & Trust:</strong> Performing reference audits, identity checks, and regulatory compliance on healthcare practitioners.</li>
                    <li><strong>Platform Communication:</strong> Sending automated booking updates, alerts, scheduling modifications, and support notifications.</li>
                    <li><strong>Safety Audits:</strong> Reviewing ratings and complaints to maintain care standards across Maharashtra.</li>
                  </ul>
                </div>
              </section>

              {/* Section 4: Information Sharing */}
              <section id="share" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    4. Information Sharing & Disclosures
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    <strong>We do not sell, lease, or distribute your personal or medical data to third-party marketing companies.</strong>
                  </p>
                  <p>
                    Your data is shared only under specific, secure situations:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li><strong>With Matched Caregivers:</strong> Matched nurses receive necessary details (name, home address, medical requirements) to perform home visits safely.</li>
                    <li><strong>Payment Processors:</strong> Necessary payment parameters are transmitted securely using industry-standard gateways for billing.</li>
                    <li><strong>Emergency Assistance:</strong> If a caregiver reports a clinical emergency at a home, data will be provided to ambulance or emergency staff.</li>
                    <li><strong>Legal & Compliance:</strong> When required by court mandates, regulatory investigations, or to protect the safety of our users.</li>
                  </ul>
                </div>
              </section>

              {/* Section 5: Medical Data Security */}
              <section id="security" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    5. Safeguards & Medical Data Security
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    Because health information is sensitive, CareNest implements a multi-tier security framework:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li><strong>Encryption:</strong> Data is encrypted using SSL/TLS in transit, and databases are stored using standard AES-256 encryption keys at rest.</li>
                    <li><strong>Access Limits:</strong> Administrative staff can access medical logs only when troubleshooting bookings, strictly audited.</li>
                    <li><strong>Session Security:</strong> Protected dashboards require token-based authentication and log out automatically during inactivity.</li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    *Note: While we apply advanced security protocols, no transmission over the internet or cloud database is 100% secure. We encourage users to maintain robust profile passwords.
                  </p>
                </div>
              </section>

              {/* Section 6: Your Rights */}
              <section id="rights" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    6. Your Rights & Control
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-3">
                  <p>
                    You maintain complete ownership of your personal information. Your rights include:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-600 pl-2">
                    <li><strong>Access & Export:</strong> Request copies of all profile records and past booking logs.</li>
                    <li><strong>Modification:</strong> Correct errors or update changed medical states directly inside your portal.</li>
                    <li><strong>Deletion ("Right to be Forgotten"):</strong> Request close of account and removal of personal details (subject to billing/medical records compliance requirements).</li>
                    <li><strong>Consent Management:</strong> Customize cookie parameters or email notification subscriptions.</li>
                  </ul>
                </div>
              </section>

              {/* Section 7: Contact Info */}
              <section id="contact" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 font-heading">
                    7. Contacting Our Privacy Team
                  </h2>
                </div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                  <p className="mb-4">
                    For requests concerning this Privacy Policy, please contact our Data Protection Officer:
                  </p>
                  <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 text-sm space-y-2 max-w-md">
                    <p className="font-bold text-gray-900">CareNest Privacy & Trust Dept.</p>
                    <p className="text-gray-600">Email: <a href="mailto:privacy@carenest.in" className="text-purple-600 hover:underline font-semibold">privacy@carenest.in</a></p>
                    <p className="text-gray-600">Address: Aurangabad, Maharashtra, India</p>
                    <p className="text-gray-600">Support Desk: +91 98765 43210</p>
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

export default Privacy

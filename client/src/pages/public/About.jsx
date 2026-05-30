import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

const About = () => {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    { value: '15,000+', label: 'Successful Home Visits', desc: 'Providing tailored nursing services at patient doorsteps.' },
    { value: '500+', label: 'Verified Nurses', desc: 'Background-checked, experienced, and certified healthcare specialists.' },
    { value: '4.9★', label: 'Average Care Rating', desc: 'Rated highly by thousands of satisfied families and patients.' },
    { value: '24/7', label: 'Support Coverage', desc: 'Always available for bookings, emergencies, and medical support.' }
  ]

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-purple-600" />,
      title: 'Empathy & Compassion',
      desc: 'We treat every patient like our own family member, listening to their needs and providing compassionate medical support.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
      title: 'Trust & Verification',
      desc: 'Security is our priority. Every caregiver on our platform undergoes rigorous multi-step background checks and document audits.'
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: 'Clinical Excellence',
      desc: 'We select licensed professionals with proven track records of safety, adherence to healthcare regulations, and patient care.'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Prompt Accessibility',
      desc: 'Timely care saves lives. We ensure immediate matchmaking and flexible scheduling to accommodate all patient requests.'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'CareNest is Founded',
      desc: 'Launched with a mission to bridge the gap between skilled private duty nurses and patients in need of personalized at-home clinical attention.'
    },
    {
      year: '2025',
      title: 'Platform Upgrade',
      desc: 'Added nurse verification systems, automated booking tools, real-time status tracking, and 24/7 customer support portals.'
    },
    {
      year: '2026',
      title: '500+ Verified Nurses & Beyond',
      desc: 'Recognized as one of the region’s premier and most reliable home healthcare platforms, assisting thousands of families daily.'
    }
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left side text info */}
            <div className={`transition-all duration-1000 ease-out transform ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <Badge className="mb-3 bg-purple-100 text-purple-700 hover:bg-purple-100 border-none" variant="secondary">
                ✨ Empowering At-Home Healthcare
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
                Redefining Home Nursing With{' '}
                <span className="text-purple-600">Love and Expertise</span>
              </h1>
              <p className="text-gray-500 text-xs md:text-sm mb-5 leading-relaxed">
                CareNest is built to empower patients, seniors, and recovering individuals by connecting them with licensed, certified, and compassionate nurses. We make elite home healthcare reliable, seamless, and fully stress-free.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/services')}
                  style={{ borderRadius: '0.75rem' }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-7 border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Explore Care Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/contact')}
                  style={{ borderRadius: '0.75rem' }}
                  className="border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50 hover:border-purple-300 font-semibold px-7 transition-all duration-300"
                >
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Rotating UI Graphic */}
            <div className={`hidden md:flex items-center justify-center relative transition-all duration-1000 delay-300 ease-out transform ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="relative w-80 h-80 bg-white rounded-full flex items-center justify-center shadow-xl border border-purple-100">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-600/40 animate-spin-slow"></div>
                <div className="absolute inset-3 rounded-full border-2 border-dotted border-purple-400/30 animate-spin-reverse"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <Heart className="w-20 h-20 text-purple-600 fill-purple-50 animate-pulse" />
                  <span className="font-bold text-lg text-purple-600">CareNest</span>
                </div>
              </div>

              {/* Floating micro-badges */}
              <div className="absolute top-10 right-4 bg-white/95 rounded-xl px-3.5 py-2 shadow-lg border border-purple-100">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-semibold text-gray-800">Compassion First</span>
                </div>
              </div>
              <div className="absolute bottom-10 left-4 bg-white/95 rounded-xl px-3.5 py-2 shadow-lg border border-purple-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-gray-800">100% Certified</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-4 bg-white border-y border-purple-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center p-5 bg-slate-50 border border-purple-50/50 shadow-[0_4px_15px_-4px_rgba(168,85,247,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(168,85,247,0.06)] transition-all duration-300"
                style={{ borderRadius: '1rem' }}
              >
                <p className="text-2xl font-bold text-purple-600 mb-1">{stat.value}</p>
                <p className="font-semibold text-gray-900 text-xs mb-1">{stat.label}</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full inline-block mb-2">
              Our Foundations
            </span>
            <h2 className="text-xl md:text-2.5xl font-bold text-gray-900 mb-2 tracking-tight">
              The Principles That Guide Us
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-xs">
              Every nurse, booking, and medical consultation on CareNest is underpinned by our dedication to professional integrity and patients' physical well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <Card 
                key={idx} 
                style={{ borderRadius: '1.25rem' }}
                className="border-purple-100/50 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.04)] hover:shadow-[0_12px_30px_-6px_rgba(168,85,247,0.09)] hover:border-purple-200/80 transition-all duration-300 group"
              >
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    {val.icon}
                  </div>
                  <h3 className="font-semibold text-base mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">{val.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed flex-1">{val.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-14 px-4 bg-slate-50 border-t border-purple-100/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full inline-block mb-2">
              Our History
            </span>
            <h2 className="text-xl md:text-2.5xl font-bold text-gray-900 mb-2 tracking-tight">
              CareNest's Growth & Journey
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-xs">
              How we evolved from an initial concept into a trusted lifesaver for thousands of families.
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative border-l-2 border-purple-200/50 ml-4 md:ml-8 pl-8 space-y-10">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative group">
                {/* Milestone Node */}
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-purple-600 flex items-center justify-center transition-transform duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping"></div>
                </div>

                <div 
                  style={{ borderRadius: '1rem' }}
                  className="bg-white p-5 border border-purple-100/50 shadow-[0_4px_15px_-4px_rgba(168,85,247,0.03)] hover:border-purple-200/50 transition-all duration-300"
                >
                  <span className="text-[10px] font-semibold text-purple-700 px-2 py-0.5 bg-purple-50 rounded-md">
                    {ms.year}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-1.5">{ms.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Call To Action Section */}
      <section className="py-14 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center bg-white p-8 md:p-12 rounded-3xl border border-purple-100/50 shadow-[0_10px_40px_-12px_rgba(168,85,247,0.08)]">
          <Badge className="mb-3 bg-purple-50 text-purple-700 hover:bg-purple-50 border-none" variant="secondary">
            🤝 Ready to get started?
          </Badge>
          <h2 className="text-xl md:text-2.25xl font-bold text-gray-900 mb-2 tracking-tight">
            Secure the Absolute Best Care for Your Family
          </h2>
          <p className="text-gray-500 text-xs mb-6 max-w-md mx-auto leading-relaxed">
            Register as a patient to book top-tier local nurses, or join our professional nurse network to empower families in your community today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/customer/register')}
              style={{ borderRadius: '0.75rem' }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              Register as Patient
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/nurse/register')}
              style={{ borderRadius: '0.75rem' }}
              className="border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50 hover:border-purple-300 font-semibold px-8 transition-all duration-300"
            >
              Join as a Nurse
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default About

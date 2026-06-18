import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Button } from '@/components/ui/button'
import { useGetMilestonesQuery } from '@/redux/apis/bookingApi'
import {
  Heart,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  Star
} from 'lucide-react'

import imgElderCare from '@/assets/about_elder_care.png'
import imgChildCare from '@/assets/about_child_care.png'
import imgRehabCare from '@/assets/about_rehab_care.png'
import imgFamilyCare from '@/assets/about_family_care.png'

const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width || canvas.clientWidth || 400
      canvas.height = rect.height || canvas.clientHeight || 300
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles = []
    const particleCount = 24

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * 20
        this.size = Math.random() * 8 + 4
        this.speedY = Math.random() * 0.4 + 0.2
        this.speedX = (Math.random() - 0.5) * 0.25
        this.opacity = Math.random() * 0.4 + 0.1
        this.type = Math.random() > 0.5 ? 'cross' : 'circle'
        this.rotate = Math.random() * Math.PI
        this.rotateSpeed = (Math.random() - 0.5) * 0.02
      }

      update() {
        this.y -= this.speedY
        this.x += this.speedX
        this.rotate += this.rotateSpeed

        if (this.y < 60) {
          this.opacity -= 0.005
        }

        if (this.y < 0 || this.opacity <= 0 || this.x < 0 || this.x > canvas.width) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotate)
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = '#9333ea'

        if (this.type === 'cross') {
          const thickness = this.size / 3
          ctx.fillRect(-this.size / 2, -thickness / 2, this.size, thickness)
          ctx.fillRect(-thickness / 2, -this.size / 2, thickness, this.size)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 3.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new Particle()
      p.y = Math.random() * canvas.height
      particles.push(p)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}

const About = () => {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const valuesRef = useRef(null)
  const [valuesVisible, setValuesVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const observers = []

    const makeObs = (ref, setter) => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true) }, { threshold: 0.15 })
      if (ref.current) obs.observe(ref.current)
      observers.push(obs)
    }

    makeObs(statsRef, setStatsVisible)
    makeObs(valuesRef, setValuesVisible)

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const stats = [
    { value: '15,000+', label: 'Successful Home Visits', icon: <Users className="w-5 h-5 text-purple-500" /> },
    { value: '500+', label: 'Verified Nurses', icon: <ShieldCheck className="w-5 h-5 text-purple-500" /> },
    { value: '4.9★', label: 'Average Care Rating', icon: <Star className="w-5 h-5 text-purple-500" /> },
    { value: '24/7', label: 'Support Coverage', icon: <Clock className="w-5 h-5 text-purple-500" /> },
  ]

  const values = [
    {
      icon: <Heart className="w-5 h-5 text-purple-600" />,
      title: 'Empathy & Compassion',
      desc: 'We treat every patient like our own family member, listening to their needs and providing compassionate medical support.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      title: 'Trust & Verification',
      desc: 'Security is our priority. Every caregiver undergoes rigorous multi-step background checks and document audits.'
    },
    {
      icon: <Award className="w-5 h-5 text-purple-600" />,
      title: 'Clinical Excellence',
      desc: 'We select licensed professionals with proven track records of safety, healthcare regulation adherence, and patient care.'
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      title: 'Prompt Accessibility',
      desc: 'Timely care saves lives. We ensure immediate matchmaking and flexible scheduling for all patient requests.'
    },
  ]

  const { data: dbMilestones } = useGetMilestonesQuery()

  const staticMilestones = [
    {
      year: '2024',
      title: 'CareNest is Founded',
      desc: 'Launched with a mission to bridge the gap between skilled private duty nurses and patients needing personalized at-home clinical attention.'
    },
    {
      year: '2025',
      title: 'Platform Upgrade',
      desc: 'Added nurse verification systems, automated booking tools, real-time status tracking, and 24/7 customer support portals.'
    },
    {
      year: '2026',
      title: '500+ Verified Nurses & Beyond',
      desc: 'Recognized as the region\'s premier home healthcare platform, assisting thousands of families daily across Maharashtra.'
    },
  ]

  const milestones = dbMilestones?.result && dbMilestones.result.length > 0
    ? dbMilestones.result
    : staticMilestones

  return (
    <PublicLayout>

      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-20 px-4" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 40%, #fff 100%)' }}>
        {/* Background blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.07] pointer-events-none" style={{ background: 'radial-gradient(ellipse, #9333ea 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8 flex justify-start">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-purple-100 hover:text-purple-700 text-gray-500 transition-all duration-300 rounded-full text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 text-purple-500" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div className={`transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-purple-200 bg-purple-50">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-bold text-purple-700 tracking-wide font-sans">Empowering At-Home Healthcare</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-5 tracking-tight font-heading">
                Redefining Home Nursing<br />With{' '}
                <span
                  className="font-black font-heading"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Love & Expertise
                </span>
              </h1>

              <p className="font-sans text-gray-500 text-base md:text-[17px] mb-8 leading-relaxed max-w-lg">
                CareNest connects patients, seniors, and recovering individuals with licensed, certified, and compassionate nurses. We make elite home healthcare reliable, seamless, and fully stress-free.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Button
                  size="lg"
                  onClick={() => navigate('/services')}
                  className="text-white font-bold px-8 rounded-xl border-none transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 4px 16px rgba(147,51,234,0.35)' }}
                >
                  Explore Services
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="rounded-xl border-purple-200 text-purple-700 bg-purple-50/60 hover:bg-purple-100/60 hover:border-purple-300 font-semibold px-8 transition-all duration-300"
                >
                  Contact Support
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />, text: '100% Verified Nurses' },
                  { icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />, text: 'Background Checked' },
                  { icon: <Star className="w-3.5 h-3.5 text-amber-400" />, text: '4.9 Avg Rating' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    {b.icon}
                    {b.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Photo Collage */}
            <div className={`transition-all duration-1000 delay-300 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="grid grid-cols-2 gap-3">
                {/* Large top-left */}
                <div className="row-span-2 relative overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: '3/4', boxShadow: '0 8px 32px rgba(147,51,234,0.12)' }}>
                  <img src={imgElderCare} alt="Nurse caring for elderly patient" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white" style={{ background: 'linear-gradient(to top, rgba(10,5,30,0.75) 0%, transparent 100%)' }}>
                    <p className="text-[11px] font-semibold">Elder Care</p>
                  </div>
                </div>

                {/* Top-right */}
                <div className="relative overflow-hidden rounded-2xl shadow-md" style={{ boxShadow: '0 6px 24px rgba(147,51,234,0.1)' }}>
                  <img src={imgChildCare} alt="Nurse with child patient" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" style={{ aspectRatio: '4/3' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white" style={{ background: 'linear-gradient(to top, rgba(10,5,30,0.75) 0%, transparent 100%)' }}>
                    <p className="text-[11px] font-semibold">Child Care</p>
                  </div>
                </div>

                {/* Bottom-right split: 2 smaller */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="relative overflow-hidden rounded-2xl shadow-md" style={{ boxShadow: '0 6px 24px rgba(147,51,234,0.1)' }}>
                    <img src={imgRehabCare} alt="Rehabilitation care" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" style={{ aspectRatio: '4/3' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white" style={{ background: 'linear-gradient(to top, rgba(10,5,30,0.75) 0%, transparent 100%)' }}>
                      <p className="text-[11px] font-semibold">Rehab Support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4th image as accent strip below */}
              <div className="mt-3 relative overflow-hidden rounded-2xl shadow-md" style={{ boxShadow: '0 6px 24px rgba(147,51,234,0.1)' }}>
                <img src={imgFamilyCare} alt="Family care consultation" className="w-full object-cover transition-transform duration-500 hover:scale-105" style={{ height: '130px', objectPosition: 'center 30%' }} />
                <div className="absolute inset-0 flex items-center px-5 text-white" style={{ background: 'linear-gradient(to right, rgba(10,5,30,0.72) 0%, rgba(10,5,30,0.28) 100%)' }}>
                  <div>
                    <p className="text-sm font-black font-heading">Family-Centered Care</p>
                    <p className="text-[11px] text-white/70 mt-0.5">Compassionate support for the whole family</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ──────────────────────────────────── */}
      <section ref={statsRef} className="py-14 px-4 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  transitionDelay: statsVisible ? `${idx * 100}ms` : '0ms',
                  borderRadius: '1.125rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
                className={`text-center p-6 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-[0_8px_24px_-6px_rgba(147,51,234,0.1)] transition-all duration-500 group transform ${statsVisible ? 'opacity-100 translate-y-0 duration-700 ease-out' : 'opacity-0 translate-y-8'}`}
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)' }}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-black text-purple-700 mb-1 font-heading">{stat.value}</p>
                <p className="text-xs font-semibold text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES ──────────────────────────────────── */}
      <section ref={valuesRef} className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full inline-block mb-4">
              Our Foundations
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight font-heading">
              The Principles That Guide Us
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
              Every nurse, booking, and consultation on CareNest is underpinned by our dedication to professional integrity and patient well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, idx) => (
              <div
                key={idx}
                style={{
                  transitionDelay: valuesVisible ? `${idx * 120}ms` : '0ms',
                  borderRadius: '1.125rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
                className={`p-7 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.12)] transition-all duration-500 hover:-translate-y-1.5 group transform ${valuesVisible ? 'opacity-100 translate-y-0 duration-700 ease-out' : 'opacity-0 translate-y-12'}`}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)', boxShadow: '0 2px 8px rgba(147,51,234,0.08)' }}>
                  {val.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2.5 tracking-tight group-hover:text-purple-700 transition-colors font-heading text-sm">
                  {val.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE SECTION ──────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-gray-100" style={{ background: 'linear-gradient(180deg, #fafafa 0%, #f5f3ff 50%, #fafafa 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full inline-block mb-4">
              Our History
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight font-heading">
              CareNest's Growth & Journey
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
              How we evolved from an initial concept into a trusted lifesaver for thousands of families.
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(147,51,234,0.3) 10%, rgba(147,51,234,0.3) 90%, transparent)' }} />

            <div className="space-y-10">
              {milestones.map((ms, idx) => (
                <div key={idx} className={`relative flex gap-8 items-start ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-purple-600 bg-white z-10" style={{ boxShadow: '0 0 0 4px rgba(147,51,234,0.12)' }} />

                  {/* Card */}
                  <div className={`ml-16 md:ml-0 md:w-[45%] ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                      <span className="text-xs font-black text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full inline-block mb-3">
                        {ms.year}
                      </span>
                      <h3 className="font-bold text-gray-900 mb-2 font-heading">{ms.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{ms.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="rounded-3xl p-10 md:p-14 bg-transparent border border-purple-200 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-purple-300"
          >
            {/* Particle Canvas Animation */}
            <ParticleCanvas />

            {/* Subtle background glow */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, #9333ea 0%, transparent 70%)', filter: 'blur(40px)' }}
            />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full mb-5 font-sans hover:scale-105 hover:-rotate-1 transition-all duration-300 cursor-default">
                🤝 Ready to get started?
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight font-heading leading-tight">
                Secure the{' '}
                <span
                  className="font-black font-heading"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Best Care
                </span><br />for Your Family
              </h2>
              <p className="text-gray-500 text-base mb-8 max-w-md mx-auto leading-relaxed font-sans">
                Register as a patient to book top-tier nurses, or join our professional nurse network to empower families in your community.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/customer/register')}
                  className="text-white font-bold px-8 rounded-xl border-none transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', boxShadow: '0 4px 16px rgba(147,51,234,0.35)' }}
                >
                  Register as Patient
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/nurse/register')}
                  className="rounded-xl border-purple-200 text-purple-700 bg-purple-50/60 hover:bg-purple-100/60 hover:border-purple-300 font-semibold px-8 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Join as a Nurse
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}

export default About

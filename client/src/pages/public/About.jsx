import React from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Award, 
  Calendar, 
  Activity, 
  Clock, 
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const About = () => {
  const navigate = useNavigate()

  const stats = [
    { value: '15,000+', label: 'Successful Home Visits', desc: 'Providing tailored nursing services at patient doorsteps.' },
    { value: '500+', label: 'Verified Nurses', desc: 'Background-checked, experienced, and certified healthcare specialists.' },
    { value: '4.9★', label: 'Average Care Rating', desc: 'Rated highly by thousands of satisfied families and patients.' },
    { value: '24/7', label: 'Support Coverage', desc: 'Always available for bookings, emergencies, and medical support.' }
  ]

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: 'Empathy & Compassion',
      desc: 'We treat every patient like our own family member, listening to their needs and providing compassionate medical support.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Trust & Verification',
      desc: 'Security is our priority. Every caregiver on our platform undergoes rigorous multi-step background checks and document audits.'
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: 'Clinical Excellence',
      desc: 'We select licensed professionals with proven track records of safety, adherence to healthcare regulations, and patient care.'
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
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
      <section className="bg-linear-to-br from-primary/20 via-background to-secondary/10 py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">
                ✨ Empowering At-Home Healthcare
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                Redefining Home Nursing With{' '}
                <span className="text-primary">Love and Expertise</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                CareNest is built to empower patients, seniors, and recovering individuals by connecting them with licensed, certified, and compassionate nurses. We make elite home healthcare reliable, seamless, and fully stress-free.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate('/services')}>
                  Explore Care Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Rotating UI Graphic */}
            <div className="hidden md:flex items-center justify-center relative">
              <div className="relative w-80 h-80 bg-linear-to-br from-primary/10 via-background to-secondary/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border border-primary/20">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/50 animate-spin-slow"></div>
                <div className="absolute inset-3 rounded-full border-2 border-dotted border-secondary/40 animate-spin-reverse"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <Heart className="w-24 h-24 text-primary fill-primary/10 animate-pulse" />
                  <span className="font-bold text-lg text-primary">CareNest</span>
                </div>
              </div>

              {/* Floating micro-badges */}
              <div className="absolute top-10 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-xl px-3 py-2 shadow-lg border border-primary/10">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Compassion First</span>
                </div>
              </div>
              <div className="absolute bottom-10 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs rounded-xl px-3 py-2 shadow-lg border border-primary/10">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs font-semibold text-foreground">100% Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-background rounded-2xl border border-border/40 shadow-xs hover:shadow-md transition-all duration-300">
                <p className="text-4xl font-extrabold text-primary mb-2">{stat.value}</p>
                <p className="font-bold text-foreground text-md mb-2">{stat.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3" variant="outline">Our Foundations</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Principles That Guide Us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every nurse, booking, and medical consultation on CareNest is underpinned by our dedication to professional integrity and patients' physical well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <Card key={idx} className="hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    {val.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-foreground">{val.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{val.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-muted/10 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3" variant="outline">Our History</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              CareNest's Growth & Journey
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              How we evolved from an initial concept into a trusted lifesaver for thousands of families.
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 pl-8 space-y-12">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative group">
                {/* Milestone Node */}
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-background border-4 border-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                </div>

                <div className="bg-background p-6 rounded-xl border border-border/60 shadow-xs hover:border-primary/30 transition-all duration-300">
                  <span className="text-sm font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                    {ms.year}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-3 mb-2">{ms.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Call To Action Section */}
      <section className="py-20 px-4 bg-linear-to-br from-primary/30 via-background to-secondary/20">
        <div className="max-w-4xl mx-auto text-center bg-background/80 backdrop-blur-md p-10 md:p-16 rounded-3xl border border-primary/20 shadow-2xl">
          <Badge className="mb-4" variant="secondary">
            🤝 Ready to get started?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Secure the Absolute Best Care for Your Family
          </h2>
          <p className="text-muted-foreground text-md mb-8 max-w-xl mx-auto leading-relaxed">
            Register as a patient to book top-tier local nurses, or join our professional nurse network to empower families in your community today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/95 text-white" onClick={() => navigate('/customer/register')}>
              Register as Patient
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/nurse/register')}>
              Join as a Nurse
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default About

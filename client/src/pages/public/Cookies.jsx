import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ShieldAlert,
  Cookie,
  Activity,
  Settings,
  Target,
  CheckCircle2,
  Lock
} from 'lucide-react'

const Cookies = () => {
  const navigate = useNavigate()
  
  // Local states for the cookie categories
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true, // Always on
    performance: true,
    functional: true,
    targeting: false
  })

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('carenest_cookie_preferences')
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs)
        setCookiePrefs({
          ...parsed,
          essential: true // Enforce essential is always true
        })
      }
    } catch (e) {
      console.error('Failed to load cookie preferences', e)
    }
  }, [])

  // Toggle a single preference
  const togglePref = (key) => {
    if (key === 'essential') return // Cannot turn off essential
    setCookiePrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Save current settings to localStorage
  const savePreferences = () => {
    try {
      localStorage.setItem('carenest_cookie_preferences', JSON.stringify(cookiePrefs))
      toast.success('Your cookie preferences have been updated!')
    } catch (e) {
      toast.error('Failed to save cookie preferences.')
    }
  }

  // Accept all cookies
  const acceptAll = () => {
    const allOn = {
      essential: true,
      performance: true,
      functional: true,
      targeting: true
    }
    setCookiePrefs(allOn)
    try {
      localStorage.setItem('carenest_cookie_preferences', JSON.stringify(allOn))
      toast.success('All cookies have been accepted!')
    } catch (e) {
      toast.error('Failed to save preferences.')
    }
  }

  // Reject non-essential cookies
  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      performance: false,
      functional: false,
      targeting: false
    }
    setCookiePrefs(onlyEssential)
    try {
      localStorage.setItem('carenest_cookie_preferences', JSON.stringify(onlyEssential))
      toast.success('Non-essential cookies have been disabled.')
    } catch (e) {
      toast.error('Failed to save preferences.')
    }
  }

  return (
    <PublicLayout>
      <div className="relative min-h-screen bg-slate-50/50 pb-24">
        {/* Background blobs */}
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

            <div className="max-w-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-1 font-heading">
                  Cookie Settings
                </h1>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  Manage your data collection preferences. Customize which cookies CareNest is allowed to use during your sessions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-4xl mx-auto px-4 mt-10">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-8">
            
            {/* Brief description and general explanation */}
            <div className="bg-purple-50/30 border border-purple-100/60 p-6 rounded-2xl flex items-start gap-4">
              <ShieldAlert className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-900 mb-1">About Cookies on CareNest</p>
                <p>
                  Cookies are tiny text files stored on your computer or mobile device when you browse websites. We use them to verify your authentication token, remember dashboard scheduling choices, and collect statistics that help us make CareNest faster and more reliable. You can adjust your preferences below at any time.
                </p>
              </div>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4">
              
              {/* Essential Cookies (Always Enabled) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/65 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-sm flex items-center gap-2">
                      Essential Cookies
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Required
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-lg">
                      These cookies are critical to operate our platform securely. They handle user login status, security session verifications, and system billing requests.
                    </p>
                  </div>
                </div>
                {/* Always-on checkbox representation */}
                <div className="flex items-center shrink-0 self-end md:self-center">
                  <label className="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" checked={true} disabled className="sr-only peer" />
                    <div className="w-11 h-6 bg-purple-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-disabled:opacity-50"></div>
                  </label>
                </div>
              </div>

              {/* Performance & Analytics Cookies */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:bg-slate-50/30 transition-all">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-sm">
                      Performance & Analytics Cookies
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-lg">
                      These gather anonymous statistics regarding which pages users visit most frequently, helping us identify loading bottlenecks and improve scheduling flows.
                    </p>
                  </div>
                </div>
                {/* Switch Toggle */}
                <div className="flex items-center shrink-0 self-end md:self-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePrefs.performance}
                      onChange={() => togglePref('performance')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:bg-slate-50/30 transition-all">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                    <Settings className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-sm">
                      Functional Cookies
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-lg">
                      Used to remember basic preferences, such as selected region filters, language parameters, or customized sidebar layout preferences.
                    </p>
                  </div>
                </div>
                {/* Switch Toggle */}
                <div className="flex items-center shrink-0 self-end md:self-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePrefs.functional}
                      onChange={() => togglePref('functional')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Targeting & Personalization Cookies */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:bg-slate-50/30 transition-all">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-sm">
                      Targeting & Advertising Cookies
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-lg">
                      These let us coordinate feedback surveys and offer specialized packages or promotions relevant to your care history. We never sell this information.
                    </p>
                  </div>
                </div>
                {/* Switch Toggle */}
                <div className="flex items-center shrink-0 self-end md:self-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePrefs.targeting}
                      onChange={() => togglePref('targeting')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
              
              {/* Quick Actions (Accept All / Reject All) */}
              <div className="flex flex-wrap gap-2.5">
                <Button
                  variant="outline"
                  onClick={rejectAll}
                  className="rounded-xl border-purple-100 text-purple-700 bg-purple-50/50 hover:bg-purple-100/60 font-semibold px-5 transition-all text-xs"
                >
                  Reject Non-Essential
                </Button>
                <Button
                  variant="outline"
                  onClick={acceptAll}
                  className="rounded-xl border-purple-200 text-purple-800 bg-purple-50/70 hover:bg-purple-100/70 font-bold px-5 transition-all text-xs"
                >
                  Accept All
                </Button>
              </div>

              {/* Save Preferences */}
              <Button
                onClick={savePreferences}
                className="text-white font-bold px-7 rounded-xl border-none transition-all duration-300 text-xs shadow-md shadow-purple-600/10"
                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Save Preferences
              </Button>

            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Cookies

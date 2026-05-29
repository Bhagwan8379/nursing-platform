import { Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home'
import Service from './pages/public/Service'
import AllServices from './pages/public/AllServices'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import PatientLogin from './pages/auth/PatientLogin'
import NurseLogin from './pages/auth/NurseLogin'
import AdminLogin from './pages/auth/AdminLogin'
import PatientRegister from './pages/auth/PatientRegister'
import NurseRegister from './pages/auth/NurseRegister'
import PatientDashboard from './pages/customer/PatientDashboard'
import NurseDashboard from './pages/nurse/NurseDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<AllServices />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth Portals */}
        <Route path="/customer/login" element={<PatientLogin />} />
        <Route path="/nurse/login" element={<NurseLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/customer/register" element={<PatientRegister />} />
        <Route path="/nurse/register" element={<NurseRegister />} />
        
        {/* Portals & Dashboards */}
        <Route path="/customer/dashboard" element={<PatientDashboard />} />
        <Route path="/nurse/dashboard" element={<NurseDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  )
}

export default App
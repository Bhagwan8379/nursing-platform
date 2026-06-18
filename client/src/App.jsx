import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from '@/components/ui/sonner'
import PremiumLoader from './components/PremiumLoader'

const FallBackError = lazy(() => import('./components/FallBackError'))

// Lazy loaded page components
const Home = lazy(() => import('./pages/public/Home'))
const Service = lazy(() => import('./pages/public/Service'))
const AllServices = lazy(() => import('./pages/public/AllServices'))
const About = lazy(() => import('./pages/public/About'))
const Contact = lazy(() => import('./pages/public/Contact'))
const Privacy = lazy(() => import('./pages/public/Privacy'))
const Terms = lazy(() => import('./pages/public/Terms'))
const Cookies = lazy(() => import('./pages/public/Cookies'))

// Auth portals
const PatientLogin = lazy(() => import('./pages/auth/PatientLogin'))
const NurseLogin = lazy(() => import('./pages/auth/NurseLogin'))
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'))
const PatientRegister = lazy(() => import('./pages/auth/PatientRegister'))
const NurseRegister = lazy(() => import('./pages/auth/NurseRegister'))

// Dashboards
const PatientDashboard = lazy(() => import('./pages/customer/PatientDashboard'))
const NurseDashboard = lazy(() => import('./pages/nurse/NurseDashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <Home />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/services" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <AllServices />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <About />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <Contact />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <Privacy />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <Terms />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/cookies" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <Cookies />
            </ErrorBoundary>
          </Suspense>
        } />

        {/* Auth Portals */}
        <Route path="/customer/login" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <PatientLogin />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/nurse/login" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <NurseLogin />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/admin/login" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <AdminLogin />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/customer/register" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <PatientRegister />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/nurse/register" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <NurseRegister />
            </ErrorBoundary>
          </Suspense>
        } />

        {/* Portals & Dashboards */}
        <Route path="/customer/dashboard" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <PatientDashboard />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/nurse/dashboard" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <NurseDashboard />
            </ErrorBoundary>
          </Suspense>
        } />
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<PremiumLoader />}>
            <ErrorBoundary FallbackComponent={FallBackError}>
              <AdminDashboard />
            </ErrorBoundary>
          </Suspense>
        } />
      </Routes>
    </>
  )
}

export default App
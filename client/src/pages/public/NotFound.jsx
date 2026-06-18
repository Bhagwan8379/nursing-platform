import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Home, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden font-sans text-slate-800">
            {/* Background Decorative Gradients */}
            <div
                className="absolute top-0 left-1/4 w-[500px] h-[500px] opacity-[0.04] pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', filter: 'blur(80px)' }}
            />
            <div
                className="absolute bottom-10 right-1/4 w-[600px] h-[600px] opacity-[0.03] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', filter: 'blur(80px)' }}
            />

            {/* Navbar Mimic Header */}
            <header className="p-6 max-w-7xl w-full mx-auto flex items-center justify-between z-10">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-linear-to-br from-primary to-primary/80 p-1.5 rounded-lg shadow-sm">
                        <Heart className="w-5 h-5 text-white fill-white/20" />
                    </div>
                    <span className="font-heading font-black text-xl bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        CareNest
                    </span>
                </div>
            </header>

            {/* Main Center Panel */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="space-y-8"
                >
                    {/* Animated Floating Icon Container */}
                    <div className="relative w-40 h-40 mx-auto animate-float flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/5 rounded-full border border-primary/10 animate-pulse" />
                        <div className="absolute w-28 h-28 bg-teal-500/5 rounded-full border border-teal-500/10 animate-ping [animation-duration:3s]" />
                        <FileQuestion className="w-20 h-20 text-primary drop-shadow-md stroke-[1.25]" />
                    </div>

                    {/* Gradient 404 Text */}
                    <div className="space-y-3">
                        <h1 className="text-7xl md:text-8xl font-black font-heading tracking-tight leading-none bg-linear-to-r from-primary via-purple-600 to-teal-500 bg-clip-text text-transparent">
                            404
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                            Care Path Not Found
                        </h2>
                        <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                            It looks like this healthcare service link or page does not exist. Let's get you back to one of our verified portals.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                        <Button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-extrabold h-12 px-6 rounded-xl transition-all shadow-lg shadow-primary/15 hover:shadow-xl duration-300"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go Back Home
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-bold h-12 px-6 rounded-xl transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous Page
                        </Button>
                    </div>
                </motion.div>
            </main>

            {/* Footer Mimic */}
            <footer className="p-6 text-center text-xs text-slate-400 border-t border-slate-100 z-10">
                <p>&copy; {new Date().getFullYear()} CareNest Home Healthcare. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default NotFound

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowRight,
    Heart,
    Sparkles
} from 'lucide-react'
import PremiumLoader from '@/components/PremiumLoader'

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
    const navigate = useNavigate()
    const heroContainerRef = useRef(null)
    const canvasRef = useRef(null)

    // Text section ref
    const section1Ref = useRef(null)

    const imagesRef = useRef([])
    const loadedRef = useRef(new Array(250).fill(false)) // Exactly 250 frames count
    const currentFrameIndexRef = useRef(0)

    const [loadedCount, setLoadedCount] = useState(0)
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false)
    const totalFrames = 250 // Exactly 250 frames count

    // Progressive image preloader
    useEffect(() => {
        let active = true

        // Initialize HTMLImageElement objects
        const images = []
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image()
            const frameNum = String(i + 1).padStart(3, '0')
            img.src = `/hero-frames/ezgif-frame-${frameNum}.webp`
            images.push(img)
        }
        imagesRef.current = images

        // Helper to load a single image
        const loadImage = (index) => {
            return new Promise((resolve) => {
                const img = images[index]
                if (img.complete) {
                    if (!loadedRef.current[index]) {
                        loadedRef.current[index] = true
                        setLoadedCount(prev => prev + 1)
                        if (index === 0) setFirstFrameLoaded(true)
                    }
                    resolve()
                    return
                }

                img.onload = () => {
                    if (active) {
                        loadedRef.current[index] = true
                        setLoadedCount(prev => prev + 1)
                        if (index === 0) setFirstFrameLoaded(true)

                        // Redraw immediately if this is the current frame
                        if (index === currentFrameIndexRef.current) {
                            drawFrame(index)
                        }
                    }
                    resolve()
                }

                img.onerror = () => {
                    resolve() // Skip errors to continue the queue
                }
            })
        }

        // Sequential and batch loading
        const loadProgressively = async () => {
            // 1. Load the first frame immediately to render background
            await loadImage(0)

            // 2. Load the first 30 frames for initial visibility
            const initialBatch = []
            for (let i = 1; i < 30; i++) {
                initialBatch.push(loadImage(i))
            }
            await Promise.all(initialBatch)

            // 3. Load the remaining frames in small batches
            const batchSize = 15
            for (let i = 30; i < totalFrames; i += batchSize) {
                if (!active) break
                const batch = []
                for (let j = i; j < Math.min(i + batchSize, totalFrames); j++) {
                    batch.push(loadImage(j))
                }
                await Promise.all(batch)
                // Small sleep to yield to browser main thread
                await new Promise(r => setTimeout(r, 60))
            }
        }

        loadProgressively()

        return () => {
            active = false
        }
    }, [])

    // Canvas drawing helper (Aspect ratio: Cover, no stretching)
    const drawFrame = (index) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Search outward for the closest loaded frame to prevent blank screen
        let img = null
        if (loadedRef.current[index]) {
            img = imagesRef.current[index]
        } else {
            let left = index - 1
            let right = index + 1
            while (left >= 0 || right < totalFrames) {
                if (left >= 0 && loadedRef.current[left]) {
                    img = imagesRef.current[left]
                    break
                }
                if (right < totalFrames && loadedRef.current[right]) {
                    img = imagesRef.current[right]
                    break
                }
                left--
                right++
            }
        }

        if (!img) return

        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
        const imgWidth = img.width
        const imgHeight = img.height

        // Calculate aspect ratio cover coordinates
        const r = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight)
        const nw = imgWidth * r
        const nh = imgHeight * r
        const cx = (canvasWidth - nw) / 2
        const cy = (canvasHeight - nh) / 2

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(img, cx, cy, nw, nh)
    }

    // Handle canvas resizing for HD / Retina display support
    const handleResize = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        drawFrame(currentFrameIndexRef.current)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        if (firstFrameLoaded) {
            handleResize()
        }
        return () => window.removeEventListener('resize', handleResize)
    }, [firstFrameLoaded])

    // GSAP ScrollTrigger timeline setup
    useGSAP(() => {
        if (!firstFrameLoaded) return

        // Ensure canvas dimensions are up-to-date
        handleResize()

        const frameObj = { frame: 0 }
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroContainerRef.current,
                start: 'top top',
                end: '+=300%', // Pin the hero for 3 viewport heights of scroll distance
                scrub: 0.3, // Snappy scrub for perfect synchronization
                pin: true, // Native GSAP pinning for absolute reliability
                pinSpacing: true, // Automatically manages layout offsets
            }
        })

        // Frame scrub (duration 1.0)
        tl.to(frameObj, {
            frame: 249, // End at frame index 249 (for 250 total frames)
            ease: 'none',
            duration: 1.0,
            onUpdate: () => {
                const rawIndex = Math.round(frameObj.frame)
                const index = Math.max(0, Math.min(249, rawIndex)) // Clamp index between 0 and 249
                if (index !== currentFrameIndexRef.current) {
                    currentFrameIndexRef.current = index
                    drawFrame(index)
                }
            }
        }, 0)


    }, { scope: heroContainerRef, dependencies: [firstFrameLoaded] })

    // Quick statistics data
    const stats = [
        { value: '500+', label: 'Patients Served' },
        { value: '50+', label: 'Verified Nurses' },
        { value: '4.8★', label: 'Average Rating' },
    ]

    const progressPercent = Math.round((loadedCount / totalFrames) * 100)

    return (
        <div ref={heroContainerRef} className="relative w-full h-screen bg-slate-950 overflow-hidden">
            {/* Hardware-Accelerated Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block object-cover transition-opacity duration-700"
                style={{ opacity: firstFrameLoaded ? 1 : 0 }}
            />

            {/* Initial Loading Screen */}
            {!firstFrameLoaded && <PremiumLoader />}

            {/* Vignette Overlay (Slightly dark on left for text readability, fully clear on center/right to show frames beautifully) */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent z-10 pointer-events-none"
            />
            {/* Reduced top and bottom shadows */}
            <div
                className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950/45 to-transparent z-10 pointer-events-none"
            />
            <div
                className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-950/45 to-transparent z-10 pointer-events-none"
            />

            {/* ──────────────────────────────────────────────────────────────────────── */}
            {/* CONTENT OVERLAYS                                                         */}
            {/* ──────────────────────────────────────────────────────────────────────── */}

            {/* Section 1: Intro Section (Only Section 1 is kept) */}
            <div
                ref={section1Ref}
                className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-25 w-full animate-fade-in"
            >
                <div className="max-w-xl text-left">
                    <Badge
                        variant="secondary"
                        className="mb-5 px-3 py-1 bg-purple-500/10 border-purple-500/30 text-purple-300 font-medium text-xs rounded-full gap-1.5 flex items-center w-fit shadow-inner"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Trusted Home Nursing Platform
                    </Badge>

                    <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-white leading-tight mb-5 tracking-tight">
                        Professional Care{' '}
                        <span className="block mt-1 bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                            At Your Home
                        </span>
                    </h1>

                    <p className="text-white/80 text-sm sm:text-base mb-8 leading-relaxed font-sans max-w-md">
                        Connect with verified, registered nurses for clinical care at your doorstep. We bring elite hospital-grade healthcare directly to you.
                    </p>

                    <div className="flex flex-wrap gap-3.5 mb-10">
                        <Button
                            size="lg"
                            onClick={() => navigate('/customer/register')}
                            className="text-white font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 h-11 px-5 rounded-xl border-none cursor-pointer text-xs sm:text-sm"
                            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)' }}
                        >
                            Book a Nurse
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/services')}
                            className="border-white/10 hover:border-white/30 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 h-11 px-5 rounded-xl cursor-pointer text-xs sm:text-sm"
                        >
                            View Services
                        </Button>
                    </div>

                    {/* Glassmorphic Stats Bar with clean divider lines */}
                    <div className="grid grid-cols-3 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm divide-x divide-white/10 max-w-sm overflow-hidden shadow-inner">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center py-3.5 px-2 text-center">
                                <span className="text-lg sm:text-xl font-black text-purple-400 font-heading">
                                    {stat.value}
                                </span>
                                <span className="text-[9px] text-white/50 mt-1 font-semibold tracking-wider uppercase">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Progress Optimization Pill (Bottom Right) */}
            {firstFrameLoaded && progressPercent < 100 && (
                <div className="absolute bottom-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-[11px] font-semibold text-white/70 font-sans tracking-wide">
                        Optimizing visual sequence: {progressPercent}%
                    </span>
                </div>
            )}


        </div>
    )
}

export default Hero

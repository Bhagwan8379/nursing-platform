import React from 'react'
import { Heart } from 'lucide-react'

const PremiumLoader = () => {
    return (
        <>
            {/* Custom Animations for Video-like Fluid Effects */}
            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.6); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: scale(1.2); opacity: 0; }
                }
                @keyframes float-heart {
                    0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 4px 6px rgba(147, 51, 234, 0.1)); }
                    50% { transform: translateY(-4px) scale(1.05); filter: drop-shadow(0 12px 16px rgba(147, 51, 234, 0.3)); }
                }
                .animate-pulse-ring {
                    animation: pulse-ring 3s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
                }
                .animate-float-heart {
                    animation: float-heart 2.5s ease-in-out infinite;
                }
            `}</style>

            <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-slate-900 z-[9999] transition-all duration-500 overflow-hidden">
                {/* Premium Background Ambient Glow */}
                <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] top-1/4 left-1/4 animate-pulse"></div>
                <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Centered Premium Graphic Area */}
                <div className="relative flex items-center justify-center mb-8">

                    {/* Video-style Fluid Overlapping Ripple Rings */}
                    <div className="absolute w-32 h-32 bg-purple-500/20 rounded-full animate-pulse-ring"></div>
                    <div className="absolute w-32 h-32 bg-emerald-500/15 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute w-32 h-32 bg-purple-500/10 rounded-full animate-pulse-ring" style={{ animationDelay: '2s' }}></div>

                    {/* Glowing Core Background */}
                    <div className="absolute w-24 h-24 bg-gradient-to-tr from-purple-600/30 to-emerald-500/20 rounded-full blur-xl"></div>

                    {/* Elegant Outer Thin Orbit Ring */}
                    <div className="absolute w-24 h-24 rounded-full border border-purple-500/30 border-t-emerald-400 animate-spin" style={{ animationDuration: '4s' }}></div>

                    {/* Elegant Inner Dashed Orbit Ring */}
                    <div className="absolute w-20 h-20 rounded-full border border-dashed border-emerald-500/20 border-r-purple-400/60 animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>

                    {/* Central Glossy Medical Glassmorphism Card */}
                    <div className="relative w-14 h-14 bg-white/[0.07] backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_8px_32px_0_rgba(147,51,234,0.2)] border border-white/10 animate-float-heart">
                        {/* Glowing Heart Icon */}
                        <Heart className="w-7 h-7 text-emerald-400 fill-emerald-400/20 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

                        {/* Tiny premium corner accent */}
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default PremiumLoader
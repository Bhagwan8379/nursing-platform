import React from 'react'

const PremiumLoader = () => {
    return (
        <>
            {/* Custom Premium CSS Animations */}
            <style>{`
                @keyframes draw-path-1 {
                    0% { stroke-dashoffset: 400; transform: rotate(0deg); }
                    50% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -400; transform: rotate(360deg); }
                }
                @keyframes draw-path-2 {
                    0% { stroke-dashoffset: 400; transform: rotate(120deg); }
                    50% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -400; transform: rotate(480deg); }
                }
                @keyframes draw-path-3 {
                    0% { stroke-dashoffset: 400; transform: rotate(240deg); }
                    50% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -400; transform: rotate(600deg); }
                }
                @keyframes text-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes progress-shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-draw-1 {
                    stroke-dasharray: 240 240;
                    transform-origin: center;
                    animation: draw-path-1 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .animate-draw-2 {
                    stroke-dasharray: 240 240;
                    transform-origin: center;
                    animation: draw-path-2 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .animate-draw-3 {
                    stroke-dasharray: 240 240;
                    transform-origin: center;
                    animation: draw-path-3 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .animate-shimmer-text {
                    background: linear-gradient(
                        90deg,
                        #9333ea 0%,
                        #c084fc 25%,
                        #ffffff 50%,
                        #c084fc 75%,
                        #9333ea 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: text-shimmer 3.5s linear infinite;
                }
                .animate-progress {
                    animation: progress-shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>

            <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-[#070a13] z-[9999] overflow-hidden select-none">
                {/* Luxury Radial Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/10 via-violet-600/5 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>

                {/* Central Animation Area */}
                <div className="relative flex flex-col items-center justify-center">
                    
                    {/* SVG Flowing Wave */}
                    <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a78bfa" />
                                    <stop offset="100%" stopColor="#7c3aed" />
                                </linearGradient>
                                <linearGradient id="wave-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f472b6" />
                                    <stop offset="100%" stopColor="#c084fc" />
                                </linearGradient>
                                <linearGradient id="wave-grad-3" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#60a5fa" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                            
                            {/* Three intersecting flowing curves forming a stylish modern abstract nest */}
                            <path d="M 45,100 C 65,55 135,55 155,100 C 135,145 65,145 45,100 Z" stroke="url(#wave-grad-1)" strokeWidth="3" strokeLinecap="round" className="animate-draw-1" />
                            <path d="M 100,45 C 145,65 145,135 100,155 C 55,135 55,65 100,45 Z" stroke="url(#wave-grad-2)" strokeWidth="3" strokeLinecap="round" className="animate-draw-2" />
                            <path d="M 61,61 C 100,45 139,61 139,139 C 100,155 61,139 61,61 Z" stroke="url(#wave-grad-3)" strokeWidth="2.5" strokeLinecap="round" className="animate-draw-3" />
                        </svg>
                    </div>

                    {/* Premium Typography & Subtext */}
                    <div className="text-center">
                        <h1 className="font-heading font-extrabold text-[22px] tracking-[0.3em] uppercase animate-shimmer-text">
                            CareNest
                        </h1>
                        <p className="text-slate-400/80 font-sans text-xs tracking-wider mt-2.5">
                            Connecting with premium care...
                        </p>
                    </div>

                    {/* High-Precision Loading Indicator */}
                    <div className="w-40 h-[2px] bg-slate-800/40 rounded-full overflow-hidden mt-5 relative">
                        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-progress"></div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default PremiumLoader
import React from 'react'
import { Heart } from 'lucide-react'

const PremiumLoader = () => {
    return (
        <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-slate-50 z-[9999] transition-all duration-500">
            {/* Centered Graphic Area */}
            <div className="relative flex items-center justify-center mb-6">
                {/* Glowing Background Pulse */}
                <div className="absolute w-24 h-24 bg-purple-200/50 rounded-full blur-xl animate-pulse"></div>
                
                {/* Rotating Outer Dashed Orbit Ring */}
                <div className="absolute w-20 h-20 rounded-full border-4 border-dashed border-purple-600/30 animate-spin" style={{ animationDuration: '6s' }}></div>
                
                {/* Rotating Inner Dotted Orbit Ring */}
                <div className="absolute w-16 h-16 rounded-full border-2 border-dotted border-purple-400/40 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>

                {/* Central Pulsing Heart Icon */}
                <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-purple-100/50">
                    <Heart className="w-6 h-6 text-purple-600 fill-purple-50 animate-pulse" />
                </div>
            </div>

            {/* Premium Typography & Text */}
            <div className="text-center space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-purple-600 uppercase bg-purple-50 px-3 py-1 rounded-full border border-purple-100/20">
                    CareNest Home Nursing
                </span>
                <h2 className="text-lg font-black text-gray-900 font-heading">
                    Setting up your care portal...
                </h2>
                <p className="text-[11px] text-gray-400 max-w-[220px] mx-auto leading-relaxed">
                    Connecting with certified local nursing specialists near you.
                </p>
            </div>
        </div>
    )
}

export default PremiumLoader

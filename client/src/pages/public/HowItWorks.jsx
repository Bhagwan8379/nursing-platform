import { CalendarCheck, Heart, UserCheck } from 'lucide-react'
import React from 'react'

const HowItWorks = () => {

    const steps = [
        {
            icon: <CalendarCheck className="w-8 h-8 text-primary" />,
            title: 'Book a Service',
            desc: 'Select the nursing service you need, add patient details and preferred time.'
        },
        {
            icon: <UserCheck className="w-8 h-8 text-primary" />,
            title: 'Nurse Assigned',
            desc: 'Our admin assigns a verified, qualified nurse matching your requirements.'
        },
        {
            icon: <Heart className="w-8 h-8 text-primary" />,
            title: 'Care at Home',
            desc: 'Nurse arrives at your home and provides professional nursing care.'
        },
    ]
    return (
        <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Getting professional nursing care at home is simple and easy
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={step.title} className="flex flex-col items-center text-center">
                            <div className="relative">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{index + 1}</span>
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
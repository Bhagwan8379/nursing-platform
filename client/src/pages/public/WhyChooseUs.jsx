import { Card, CardContent } from '@/components/ui/card'
import { Clock, Phone, Shield, Star } from 'lucide-react'
import React from 'react'

const WhyChooseUs = () => {


    const features = [
        { icon: <Shield className="w-6 h-6 text-primary" />, title: 'Verified Nurses', desc: 'All nurses are verified with document checks and qualification validation.' },
        { icon: <Clock className="w-6 h-6 text-primary" />, title: '24/7 Available', desc: 'Book nursing services any time of the day or night.' },
        { icon: <Star className="w-6 h-6 text-primary" />, title: 'Rated & Reviewed', desc: 'Choose nurses based on real patient reviews and ratings.' },
        { icon: <Phone className="w-6 h-6 text-primary" />, title: 'Real-time Updates', desc: 'Track your nurse in real-time and get notified at every step.' },
    ]

    return (
        <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                        Why Choose CareNest?
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        We ensure the highest quality of home nursing care
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <Card key={feature.title}>
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
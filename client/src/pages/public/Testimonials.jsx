import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import React from 'react'

const Testimonials = () => {


    const testimonials = [
        {
            name: 'Rahul Patil',
            location: 'Aurangabad',
            rating: 5,
            comment: 'Excellent service! The nurse was very professional and caring. My father recovered quickly with her help.'
        },
        {
            name: 'Sunita More',
            location: 'Pune',
            rating: 5,
            comment: 'Very easy to book. The nurse arrived on time and was very knowledgeable. Highly recommended!'
        },
        {
            name: 'Amit Sharma',
            location: 'Nashik',
            rating: 4,
            comment: 'Great platform for home nursing. The booking process is simple and the nurses are qualified.'
        },
    ]

    return (
        <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                        What Patients Say
                    </h2>
                    <p className="text-muted-foreground">
                        Real experiences from real patients
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <Card key={t.name}>
                            <CardContent className="p-6">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                    "{t.comment}"
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold text-sm">
                                            {t.name[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.location}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

    )
}

export default Testimonials
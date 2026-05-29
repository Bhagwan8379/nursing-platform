import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CtaSection = () => {
    const navigate = useNavigate()
    return (
        <section className="py-16 px-4 bg-primary">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Need a Nurse at Home?
                </h2>
                <p className="text-white/80 mb-8 text-lg">
                    Book a verified nurse in minutes. Professional care at your doorstep.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => navigate('/customer/register')}
                    >
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-white border-white hover:bg-white hover:text-primary"
                        onClick={() => navigate('/nurse/register')}
                    >
                        Join as Nurse
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default CtaSection
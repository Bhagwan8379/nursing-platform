import { useNavigate } from 'react-router-dom'
import PublicLayout from '@/pages/public/PublicLayout'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import Service from './Service'
import WhyChooseUs from './WhyChooseUs'
import Testimonials from './Testimonials'
import CtaSection from './CtaSection'


const Home = () => {

    return (
        <PublicLayout>

            <Hero />
            <HowItWorks />
            <Service />
            <WhyChooseUs />
            <Testimonials />
            <CtaSection />

        </PublicLayout>
    )
}

export default Home
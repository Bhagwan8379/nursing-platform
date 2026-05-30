const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Auth = require('./models/Auth');

async function test() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected!');

        console.log('Testing Service.find({ isActive: true })...');
        const services = await Service.find({ isActive: true });
        console.log(`Found ${services.length} services successfully.`);

        console.log('Testing Booking.find({})...');
        const bookings = await Booking.find()
            .populate('serviceId', 'name price')
            .populate('assignedNurseId', 'name email mobile');
        console.log(`Found ${bookings.length} bookings successfully.`);

        process.exit(0);
    } catch (err) {
        console.error('QUERY FAILED:', err);
        process.exit(1);
    }
}

test();

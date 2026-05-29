const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    patientDetails: {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], required: true },
        weight: { type: Number, required: true },
        medicalHistory: { type: String, trim: true, required: true },
        allergies: { type: String, trim: true, required: true },
        currentMedications: { type: String, trim: true, required: true },
        emergencyContact: { type: String, trim: true },
    },
    prefrenceDate: { type: Date, required: true },
    timeSlot: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'] },
    nurseGenderPreference: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
    assignedNurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', default: null },
    customerNote: { type: String, trim: true },
    AdminNote: { type: String, trim: true },
    nurseArrivalTime: { type: Date, default: null },
    nurseCompletionTime: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    cancellationReason: { type: String },
    serviceAddress: {
        fullAddress: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true },
        pinCode: { type: String, trim: true, required: true },
    },
    status: {
        type: String,
        enum: ['pending', 'nurse_assigned', 'nurse_accepted', 'on_route', 'in_progress', 'complete', 'cancelled'],
        default: 'pending'
    },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    paymentMode: { type: String, enum: ['cash', 'online'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'] },
    totalAmount: { type: Number, required: true },
    nurseEarnings: { type: Number, default: 0 },
    adminCommission: { type: Number, default: 0 },

}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)
const asyncHandler = require('express-async-handler')
const { checkEmpty } = require('../utils/checkEmpty')
const Booking = require('../models/Booking')
const NurseProfile = require('../models/NurseProfile')
const Auth = require('../models/Auth')
const Service = require('../models/Service')

// ─── Create Booking (Customer) ─────────────────
exports.createBooking = asyncHandler(async (req, res) => {
    try {
        const {
            patientDetails,
            serviceId,
            serviceAddress,
            preferredDate,
            timeSlot,
            nurseGenderPreference,
            paymentMode,
            totalAmount,
            customerNote
        } = req.body

        const { isError, error } = checkEmpty({ serviceId, preferredDate, timeSlot, paymentMode, totalAmount })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }

        const service = await Service.findById(serviceId)
        if (!service) {
            return res.status(404).json({ message: "Service Not Found" })
        }
        if (!service.isActive) {
            return res.status(400).json({ message: "Service Not Available" })
        }

        const count = await Booking.countDocuments()
        const year = new Date().getFullYear()
        const bookingNumber = `NC-${year}-${String(count + 1).padStart(5, '0')}`

        // Defensive Mappers for Schema Compatibility
        const mappedPatientDetails = {
            name: patientDetails?.name || 'Patient Name',
            age: Number(patientDetails?.age) || 30,
            gender: (patientDetails?.gender || 'male').toLowerCase(),
            bloodGroup: patientDetails?.bloodGroup || 'O+',
            weight: Number(patientDetails?.weight) || 65,
            medicalHistory: patientDetails?.medicalHistory || 'None',
            allergies: patientDetails?.allergies || 'None',
            currentMedications: patientDetails?.currentMedications || 'None',
            emergencyContact: patientDetails?.emergencyContact || patientDetails?.mobile || ''
        }

        const mappedServiceAddress = {
            fullAddress: serviceAddress?.fullAddress || serviceAddress?.street || serviceAddress?.address || 'Address not specified',
            city: serviceAddress?.city || 'Mumbai',
            state: serviceAddress?.state || 'Maharashtra',
            pinCode: serviceAddress?.pinCode || serviceAddress?.pin || '400001'
        }

        let mappedTimeSlot = 'morning';
        if (timeSlot) {
            const lowerSlot = timeSlot.toLowerCase();
            if (lowerSlot.includes('morning')) mappedTimeSlot = 'morning';
            else if (lowerSlot.includes('afternoon')) mappedTimeSlot = 'afternoon';
            else if (lowerSlot.includes('evening')) mappedTimeSlot = 'evening';
            else if (lowerSlot.includes('night')) mappedTimeSlot = 'night';
        }

        await Booking.create({
            bookingNumber,
            customerId: req.user,
            patientDetails: mappedPatientDetails,
            serviceId,
            serviceAddress: mappedServiceAddress,
            prefrenceDate: preferredDate,
            timeSlot: mappedTimeSlot,
            nurseGenderPreference: (nurseGenderPreference || 'any').toLowerCase(),
            paymentMode: (paymentMode || 'online').toLowerCase(),
            paymentStatus: 'pending',
            totalAmount,
            customerNote,
            status: 'pending'
        })
        res.status(201).json({ message: "Booking Created Successfully", bookingNumber })

    } catch (error) {
        console.log('Error From : createBooking')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})



exports.getAllBookings = asyncHandler(async (req, res) => {
    try {
        const result = await Booking.find()
            .populate('customerId', 'name email mobile')
            .populate('serviceId', 'name price')
            .populate('assignedNurseId', 'name email mobile')
            .sort({ createdAt: -1 })

        res.json({ message: "All Bookings Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getAllBookings')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})



exports.getMyBookings = asyncHandler(async (req, res) => {
    try {
        const result = await Booking.find({ customerId: req.user })
            .populate('serviceId', 'name price')
            .populate('assignedNurseId', 'name email mobile')
            .sort({ createdAt: -1 })

        res.json({ message: "My Bookings Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getMyBookings', error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})


exports.getNurseBookings = asyncHandler(async (req, res) => {
    try {
        const result = await Booking.find({ assignedNurseId: req.user })
            .populate('customerId', 'name email mobile')
            .populate('serviceId', 'name price')
            .sort({ createdAt: -1 })

        res.json({ message: "Nurse Bookings Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getNurseBookings')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})


exports.getSingleBooking = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params

        const result = await Booking.findById(bookingId)
            .populate('customerId', 'name email mobile')
            .populate('serviceId', 'name price description')
            .populate('assignedNurseId', 'name email mobile')

        if (!result) {
            return res.status(404).json({ message: "Booking Not Found" })
        }
        res.json({ message: "Booking Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getSingleBooking')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Assign Nurse (Admin) ──────────────────────
exports.assignNurse = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params
        const { nurseId } = req.body

        // Booking आहे का?
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // Already assigned आहे का?
        if (booking.status !== 'pending') {
            return res.status(400).json({ message: "Nurse Already Assigned" })
        }

        // Nurse आहे का?
        const nurse = await Auth.findById(nurseId)
        if (!nurse) {
            return res.status(404).json({ message: "Nurse Not Found" })
        }

        // Nurse approved आहे का?
        const nurseProfile = await NurseProfile.findOne({ nurseId: nurseId })
        if (!nurseProfile || nurseProfile.verificationStatus !== 'approved') {
            return res.status(400).json({ message: "Nurse Not Approved" })
        }

        // Nurse available आहे का?
        if (nurseProfile.availabilityStatus !== 'available') {
            return res.status(400).json({ message: "Nurse Not Available" })
        }

        // Assign करतो
        await Booking.findByIdAndUpdate(bookingId, {
            assignedNurseId: nurseId,
            status: 'nurse_assigned'
        })

        // Nurse availability busy करतो
        await NurseProfile.findOneAndUpdate(
            { nurseId: nurseId },
            { availabilityStatus: 'busy' }
        )

        res.json({ message: "Nurse Assigned Successfully" })

    } catch (error) {
        console.log('Error From : assignNurse')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Accept Booking (Nurse) ────────────────────
exports.acceptBooking = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // हे booking या nurse ची आहे का?
        if (booking.assignedNurseId.toString() !== req.user.toString()) {
            return res.status(403).json({ message: "Not Your Booking" })
        }

        // Status check
        if (booking.status !== 'nurse_assigned') {
            return res.status(400).json({ message: "Booking Cannot Be Accepted" })
        }

        await Booking.findByIdAndUpdate(bookingId, {
            status: 'nurse_accepted'
        })

        res.json({ message: "Booking Accepted Successfully" })
    } catch (error) {
        console.log('Error From : acceptBooking')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})


// ─── Decline Booking (Nurse) ───────────────────
exports.declineBooking = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params
        const { reason } = req.body

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // हे booking या nurse ची आहे का?
        if (booking.assignedNurseId.toString() !== req.user.toString()) {
            return res.status(403).json({ message: "Not Your Booking" })
        }

        // Booking pending ला परत पाठवतो
        // Nurse availability available करतो
        await Booking.findByIdAndUpdate(bookingId, {
            assignedNurseId: null,
            status: 'pending',
            adminNote: `Nurse declined: ${reason || 'No reason provided'}`
        })

        await NurseProfile.findOneAndUpdate(
            { nurseId: req.user },
            { availabilityStatus: 'available' }
        )

        res.json({ message: "Booking Declined Successfully" })

    } catch (error) {
        console.log('Error From : declineBooking')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Update Booking Status (Nurse) ────────────
exports.updateBookingStatus = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params
        const { status } = req.body

        // Valid status check
        const validStatus = ['on_route', 'in_progress', 'complete']
        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid Status" })
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // हे booking या nurse ची आहे का?
        if (booking.assignedNurseId.toString() !== req.user.toString()) {
            return res.status(403).json({ message: "Not Your Booking" })
        }

        // Update data तयार करतो
        let updateData = { status }

        // Status नुसार timestamps save करतो
        if (status === 'in_progress') {
            updateData.nurseArrivalTime = new Date()
        }
        if (status === 'complete') {
            updateData.nurseCompletionTime = new Date()
            
            // Dynamic earnings splits (80% to Nurse, 20% to Admin commission)
            const nurseEarnings = booking.totalAmount * 0.8
            const adminCommission = booking.totalAmount * 0.2
            updateData.nurseEarnings = nurseEarnings
            updateData.adminCommission = adminCommission

            // Nurse availability available करतो
            await NurseProfile.findOneAndUpdate(
                { nurseId: req.user },
                {
                    availabilityStatus: 'available',
                    $inc: { totalCompleteJobs: 1 }
                }
            )
        }

        await Booking.findByIdAndUpdate(bookingId, updateData)

        res.json({ message: "Booking Status Updated Successfully" })

    } catch (error) {
        console.log('Error From : updateBookingStatus')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Cancel Booking (Customer) ─────────────────
exports.cancelBooking = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params
        const { cancellationReason } = req.body

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // हे booking या customer चं आहे का?
        if (booking.customerId.toString() !== req.user.toString()) {
            return res.status(403).json({ message: "Not Your Booking" })
        }

        // Already completed किंवा cancelled आहे का?
        if (['complete', 'cancelled'].includes(booking.status)) {
            return res.status(400).json({ message: "Booking Cannot Be Cancelled" })
        }

        // Nurse assigned असेल तर availability परत available करतो
        if (booking.assignedNurseId) {
            await NurseProfile.findOneAndUpdate({ nurseId: booking.assignedNurseId }, { availabilityStatus: 'available' })
        }

        await Booking.findByIdAndUpdate(bookingId, {
            status: 'cancelled',
            cancellationReason: cancellationReason || '',
            cancelledAt: new Date()
        })

        res.json({ message: "Booking Cancelled Successfully" })

    } catch (error) {
        console.log('Error From : cancelBooking')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Get Available Nurses For Booking (Admin) ──
exports.getAvailableNurses = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params

        // Booking detail घेतो
        const booking = await Booking.findById(bookingId)
            .populate('serviceId', 'requiredQualification')
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // Filter तयार करतो
        let filter = { verificationStatus: 'approved', availabilityStatus: 'available' }

        // Nurse gender preference असेल तर filter add करतो
        if (booking.nurseGenderPreference && booking.nurseGenderPreference !== 'any') {
            filter.gender = booking.nurseGenderPreference.toLowerCase()
        }

        // Qualification filter
        if (booking.serviceId?.requiredQualification) {
            filter.qualification = booking.serviceId.requiredQualification
        }

        const result = await NurseProfile.find(filter)
            .populate('nurseId', 'name email mobile')

        res.json({ message: "Available Nurses Fetched Successfully", result })

    } catch (error) {
        console.log('Error From : getAvailableNurses', error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
const mongoose = require('mongoose')



const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    durationHours: { type: Number, required: true },
    requiredQualification: { type: String, enum: ['ANM', 'GNM', 'B.Sc Nursing', 'B.Sc', 'M.Sc Nursing', 'M.Sc', 'Post Basic B.Sc', 'Phd'] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Service', serviceSchema)
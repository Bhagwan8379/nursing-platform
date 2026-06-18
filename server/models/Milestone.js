const mongoose = require('mongoose')

const milestoneSchema = new mongoose.Schema({
    year: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true }
}, { timestamps: true })

module.exports = mongoose.model('Milestone', milestoneSchema)

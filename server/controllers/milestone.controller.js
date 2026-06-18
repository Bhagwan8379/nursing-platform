const Milestone = require('../models/Milestone')
const asyncHandler = require('express-async-handler')

// ─── Fetch All Milestones (Public) ─────────────────────
// Automatically seeds initial records if DB is empty.
exports.getAllMilestones = asyncHandler(async (req, res) => {
    try {
        let list = await Milestone.find().sort({ year: 1 })
        
        if (list.length === 0) {
            // Seed the initial three historical milestones
            const defaults = [
                {
                    year: '2024',
                    title: 'CareNest is Founded',
                    desc: 'Launched with a mission to bridge the gap between skilled private duty nurses and patients needing personalized at-home clinical attention.'
                },
                {
                    year: '2025',
                    title: 'Platform Upgrade',
                    desc: 'Added nurse verification systems, automated booking tools, real-time status tracking, and 24/7 customer support portals.'
                },
                {
                    year: '2026',
                    title: '500+ Verified Nurses & Beyond',
                    desc: 'Recognized as the region\'s premier home healthcare platform, assisting thousands of families daily across Maharashtra.'
                }
            ]
            await Milestone.insertMany(defaults)
            list = await Milestone.find().sort({ year: 1 })
        }

        res.json({ message: "Milestones Fetched Successfully", result: list })
    } catch (error) {
        console.error('Error in getAllMilestones:', error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Create Milestone (Admin) ──────────────────────────
exports.createMilestone = asyncHandler(async (req, res) => {
    try {
        const { year, title, desc } = req.body

        if (!year || !title || !desc) {
            return res.status(400).json({ message: "All fields (year, title, desc) are required" })
        }

        const result = await Milestone.create({ year, title, desc })
        res.status(201).json({ message: "Milestone Created Successfully", result })
    } catch (error) {
        console.error('Error in createMilestone:', error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Delete Milestone (Admin) ──────────────────────────
exports.deleteMilestone = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        const result = await Milestone.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).json({ message: "Milestone Not Found" })
        }

        res.json({ message: "Milestone Deleted Successfully" })
    } catch (error) {
        console.error('Error in deleteMilestone:', error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

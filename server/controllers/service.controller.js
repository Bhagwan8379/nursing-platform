const asyncHandler = require('express-async-handler')
const { checkEmpty } = require('../utils/checkEmpty')
const Service = require('../models/Service')
const { upload } = require('../utils/upload')
const cloudinary = require('../utils/cloudinary')

// ─── Get All Services (Customer + Admin) ───────
exports.getAllServices = asyncHandler(async (req, res) => {
    try {
        const result = await Service.find({ isActive: true })
        res.json({ message: "All Services Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getAllServices', error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Get Single Service ────────────────────────
exports.getSingleService = asyncHandler(async (req, res) => {
    try {
        const { serviceId } = req.params

        const result = await Service.findById(serviceId)
        if (!result) {
            return res.status(404).json({ message: "Service Not Found" })
        }

        res.json({ message: "Service Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getSingleService')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Create Service (Admin) ────────────────────
exports.createService = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer Error", error: err })
            }

            const { name, category, description, price, durationHours, requiredQualification } = req.body

            // Required fields check
            const { isError, error } = checkEmpty({ name, category, description, price, durationHours, requiredQualification })
            if (isError) {
                return res.status(400).json({ message: "All Fields Required", error })
            }

            // Same name service already आहे का?
            const isFound = await Service.findOne({ name })
            if (isFound) {
                return res.status(409).json({ message: "Service Already Exists" })
            }

            // Icon upload
            let icon = ''
            if (req.files?.icon) {
                const { secure_url } = await cloudinary.uploader.upload(req.files.icon[0].path, {
                    folder: 'services'
                })
                icon = secure_url
            }

            await Service.create({
                name,
                category,
                description,
                price,
                durationHours,
                requiredQualification,
                icon
            })

            res.status(201).json({ message: "Service Created Successfully" })
        })
    } catch (error) {
        console.log('Error From : createService')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Update Service (Admin) ────────────────────
exports.updateService = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer Error", error: err })
            }

            const { serviceId } = req.params

            // Service आहे का check
            const service = await Service.findById(serviceId)
            if (!service) {
                return res.status(404).json({ message: "Service Not Found" })
            }

            const { name, category, description, price, durationHours, requiredQualification } = req.body

            // Icon update
            let icon = service.icon
            if (req.files?.icon) {
                // जुना icon delete करतो
                if (service.icon) {
                    const publicId = 'services/' + service.icon.split('/').pop().split('.')[0]
                    await cloudinary.uploader.destroy(publicId)
                }
                // नवीन icon upload करतो
                const { secure_url } = await cloudinary.uploader.upload(req.files.icon[0].path, {
                    folder: 'services'
                })
                icon = secure_url
            }

            await Service.findByIdAndUpdate(serviceId, {
                name,
                category,
                description,
                price,
                durationHours,
                requiredQualification,
                icon
            })

            res.json({ message: "Service Updated Successfully" })
        })
    } catch (error) {
        console.log('Error From : updateService')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Deactivate Service (Admin) ────────────────
exports.deactivateService = asyncHandler(async (req, res) => {
    try {
        const { serviceId } = req.params

        const service = await Service.findById(serviceId)
        if (!service) {
            return res.status(404).json({ message: "Service Not Found" })
        }

        if (!service.isActive) {
            return res.status(400).json({ message: "Service Already Inactive" })
        }

        await Service.findByIdAndUpdate(serviceId, { isActive: false })
        res.json({ message: "Service Deactivated Successfully" })

    } catch (error) {
        console.log('Error From : deactivateService')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Activate Service (Admin) ──────────────────
exports.activateService = asyncHandler(async (req, res) => {
    try {
        const { serviceId } = req.params

        const service = await Service.findById(serviceId)
        if (!service) {
            return res.status(404).json({ message: "Service Not Found" })
        }

        if (service.isActive) {
            return res.status(400).json({ message: "Service Already Active" })
        }

        await Service.findByIdAndUpdate(serviceId, { isActive: true })
        res.json({ message: "Service Activated Successfully" })

    } catch (error) {
        console.log('Error From : activateService')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
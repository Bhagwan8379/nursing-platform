const asyncHandler = require('express-async-handler')
const { checkEmpty } = require('../utils/checkEmpty')
const Service = require('../models/Service')
const { upload } = require('../utils/upload')
const cloudinary = require('../utils/cloudinary')


exports.getAllServices = asyncHandler(async (req, res) => {
    try {
        const result = await Service.find({ isActive: true })
        res.json({ message: "All Services Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getAllServices')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

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

exports.createService = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer Error", error: err })
            }

            const { name, category, description, price, durationHours, requiredQualification } = req.body
            const { isError, error } = checkEmpty({ name, category, description, price, durationHours, requiredQualification })
            if (isError) {
                return res.status(400).json({ message: "All Fields Required", error })
            }

            const isFound = await Service.findOne({ name })
            if (isFound) {
                return res.status(409).json({ message: "Service Already Exists" })
            }
            await Service.create({
                name,
                category,
                description,
                price,
                durationHours,
                requiredQualification,
            })

            res.status(201).json({ message: "Service Created Successfully" })
        })
    } catch (error) {
        console.log('Error From : createService')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})


exports.updateService = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer Error", error: err })
            }

            const { serviceId } = req.params
            const service = await Service.findById(serviceId)
            if (!service) {
                return res.status(404).json({ message: "Service Not Found" })
            }

            const { name, category, description, price, durationHours, requiredQualification } = req.body
            await Service.findByIdAndUpdate(serviceId, {
                name,
                category,
                description,
                price,
                durationHours,
                requiredQualification,
            })
            res.json({ message: "Service Updated Successfully" })
        })
    } catch (error) {
        console.log('Error From : updateService')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})


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
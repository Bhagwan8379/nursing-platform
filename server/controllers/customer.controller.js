const asyncHandler = require("express-async-handler")
const Auth = require("../models/Auth")
const { upload } = require("../utils/upload")
const cloudinary = require("../utils/cloudinary")
const bcrypt = require("bcryptjs")
const validator = require("validator")



exports.getAllCustomers = asyncHandler(async (req, res) => {
    try {
        const result = await Auth.find({ role: 'customer', isActive: true })
        res.json({ message: "All Customers Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getAllCustomers')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.getCustomerInfo = asyncHandler(async (req, res) => {
    try {
        const result = await Auth.findById(req.user)
        if (!result) {
            return res.status(404).json({ message: "Customer Not Found" })
        }
        res.json({ message: "Customer Info Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getCustomerInfo')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.updateCustomerInfo = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer Error", error: err })
            }

            const customer = await Auth.findById(req.user)
            if (!customer) {
                return res.status(404).json({ message: "Customer Not Found" })
            }
            const { name, mobile } = req.body

            let profilePhoto = customer.profilePhoto
            if (req.files?.profilePhoto) {
                if (customer.profilePhoto) {
                    const publicId = customer.profilePhoto.split('/').pop().split('.')[0]
                    await cloudinary.uploader.destroy(publicId)
                }
                const { secure_url } = await cloudinary.uploader.upload(req.files.profilePhoto[0].path)
                profilePhoto = secure_url
            }

            await Auth.findByIdAndUpdate(req.user, {
                name,
                mobile,
                profilePhoto
            })
            res.json({ message: "Customer Info Updated Successfully" })
        })
    } catch (error) {
        console.log('Error From : updateCustomerInfo')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.blockCustomer = asyncHandler(async (req, res) => {
    try {
        const { customerId } = req.params
        const customer = await Auth.findById(customerId)
        if (!customer) {
            return res.status(404).json({ message: "Customer Not Found" })
        }
        if (!customer.isActive) {
            return res.status(400).json({ message: "Customer Already Blocked" })
        }
        await Auth.findByIdAndUpdate(customerId, { isActive: false })
        res.json({ message: "Customer Blocked Successfully" })

    } catch (error) {
        console.log('Error From : blockCustomer')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.unblockCustomer = asyncHandler(async (req, res) => {
    try {
        const { customerId } = req.params
        const customer = await Auth.findById(customerId)
        if (!customer) {
            return res.status(404).json({ message: "Customer Not Found" })
        }
        if (customer.isActive) {
            return res.status(400).json({ message: "Customer Already Active" })
        }
        await Auth.findByIdAndUpdate(customerId, { isActive: true })
        res.json({ message: "Customer Unblocked Successfully" })

    } catch (error) {
        console.log('Error From : unblockCustomer')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.updateCustomerPassword = asyncHandler(async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" })
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ message: "New password must be strong (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol)" })
        }

        const customer = await Auth.findById(req.user)
        if (!customer) {
            return res.status(404).json({ message: "Customer Not Found" })
        }

        const verify = await bcrypt.compare(currentPassword, customer.password)
        if (!verify) {
            return res.status(401).json({ message: "Invalid current password" })
        }

        const hash = await bcrypt.hash(newPassword, 10)
        await Auth.findByIdAndUpdate(req.user, { password: hash })

        res.json({ message: "Password updated successfully" })
    } catch (error) {
        console.log('Error From : updateCustomerPassword')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

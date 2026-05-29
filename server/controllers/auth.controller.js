const asyncHandler = require('express-async-handler')
const { checkEmpty } = require('../utils/checkEmpty')
const jwt = require('jsonwebtoken')
const Auth = require('../models/Auth')
const bcrypt = require('bcryptjs')
const validator = require('validator')


exports.customerRegister = asyncHandler(async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body
        const { isError, error } = checkEmpty({ name, email, mobile })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        if (mobile && !validator.isMobilePhone(mobile, 'en-IN')) {
            return res.status(400).json({ message: "Invalid Mobile Number" })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Provide Strong Password" })
        }

        const isFound = await Auth.findOne({ $or: [{ email }, { mobile }] })
        if (isFound) {
            return res.status(409).json('Customer Already Exist')
        }
        const hash = await bcrypt.hash(password, 10)
        await Auth.create({ name, email, mobile, password: hash, role: 'customer' })
        res.json({ message: "Customer Register Successfully" })
    } catch (error) {
        console.log('Error From : customerRegister')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.nurseRegister = asyncHandler(async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body
        const { isError, error } = checkEmpty({ name, email, mobile })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        if (mobile && !validator.isMobilePhone(mobile, 'en-IN')) {
            return res.status(400).json({ message: "Invalid Mobile Number" })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Provide Strong Password" })
        }

        const isFound = await Auth.findOne({ $or: [{ email }, { mobile }] })
        if (isFound) {
            return res.status(409).json('Nurse Already Exist')
        }
        const hash = await bcrypt.hash(password, 10)
        await Auth.create({ name, email, mobile, password: hash, role: 'nurse' })
        res.json({ message: "Nurse Register Successfully" })
    } catch (error) {
        console.log('Error From : nurseRegister')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})



exports.loginNurse = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        const { error, isError } = checkEmpty({ email, password })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Provide Strong Password" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const isFound = await Auth.findOne({ email })
        if (!isFound) {
            return res.status(404).json({ message: "Nurse Not Found", error: 'Nurse is Not Registered' })
        }
        if (isFound.role !== 'nurse') {
            return res.status(403).json({ message: "Access Denied: Not a Nurse" })
        }

        const verify = await bcrypt.compare(password, isFound.password)
        if (!verify) {
            return res.status(401).json({ message: "Invalid Password 👎" })
        }

        const token = jwt.sign({ userId: isFound._id, name: isFound.name }, process.env.JWT_KEY, { expiresIn: '7d' })
        res.cookie('nurse', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
        res.json({
            message: 'Login Success', result: {
                _id: isFound._id,
                name: isFound.name,
                mobile: isFound.mobile,
                email: isFound.email,
                role: isFound.role
            }
        })
    } catch (error) {
        console.log("Error From : loginNurse")
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.loginPatient = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        const { error, isError } = checkEmpty({ email, password })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Provide Strong Password" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const isFound = await Auth.findOne({ email })
        if (!isFound) {
            return res.status(404).json({ message: "Patient Not Found", error: 'Patient is Not Registered' })
        }
        if (isFound.role !== 'customer') {
            return res.status(403).json({ message: "Access Denied: Not a Patient" })
        }

        const verify = await bcrypt.compare(password, isFound.password)
        if (!verify) {
            return res.status(401).json({ message: "Invalid Password 👎" })
        }

        const token = jwt.sign({ userId: isFound._id, name: isFound.name }, process.env.JWT_KEY, { expiresIn: '7d' })
        res.cookie('customer', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
        res.json({
            message: 'Login Success', result: {
                _id: isFound._id,
                name: isFound.name,
                mobile: isFound.mobile,
                email: isFound.email,
                role: isFound.role
            }
        })
    } catch (error) {
        console.log("Error From : loginPatient")
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.loginAdmin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        const { error, isError } = checkEmpty({ email, password })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Provide Strong Password" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const isFound = await Auth.findOne({ email })
        if (!isFound) {
            return res.status(404).json({ message: "Admin Not Found", error: 'Admin is Not Registered' })
        }
        if (isFound.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Not an Admin" })
        }

        const verify = await bcrypt.compare(password, isFound.password)
        if (!verify) {
            return res.status(401).json({ message: "Invalid Password 👎" })
        }

        const token = jwt.sign({ userId: isFound._id, name: isFound.name }, process.env.JWT_KEY, { expiresIn: '7d' })
        res.cookie('admin', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
        res.json({
            message: 'Login Success', result: {
                _id: isFound._id,
                name: isFound.name,
                mobile: isFound.mobile,
                email: isFound.email,
                role: isFound.role
            }
        })
    } catch (error) {
        console.log("Error From : loginAdmin")
        return res.status(500).json({ message: "Internal Server Error" })
    }
})




exports.logoutAdmin = asyncHandler(async (req, res) => {
    try {
        res.clearCookie('admin')
        res.json({ message: "Admin Logout Successfully" })
    } catch (error) {
        console.log("Error From : logoutAdmin")
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.logoutNurse = asyncHandler(async (req, res) => {
    try {
        res.clearCookie('nurse')
        res.json({ message: "Nurse Logout Successfully" })
    } catch (error) {
        console.log("Error From : logoutNurse")
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.logoutCustomer = asyncHandler(async (req, res) => {
    try {
        res.clearCookie('customer')
        res.json({ message: "Customer Logout Successfully" })
    } catch (error) {
        console.log("Error From : logoutCustomer")
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
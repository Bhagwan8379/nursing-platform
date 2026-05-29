const asyncHandler = require('express-async-handler')
const { checkEmpty } = require('../utils/checkEmpty')
const Auth = require('../models/Auth')
const NurseProfile = require('../models/NurseProfile')
const { upload } = require('../utils/upload')
const cloudinary = require('../utils/cloudinary')



exports.getAllNurses = asyncHandler(async (req, res) => {
    try {
        const result = await NurseProfile.find().populate('nurseId', 'name email mobile')
        res.json({ message: "All Nurses Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getAllNurses')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.getNurseInfo = asyncHandler(async (req, res) => {
    try {
        const auth = await Auth.findById(req.user)
        const result = await NurseProfile.findOne({ nurseId: req.user })
        res.json({ message: "Nurses Info Fetched Successfully", auth, result })
    } catch (error) {
        console.log('Error From : getNurseInfo')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.createNurseInfo = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async err => {
            if (err) {
                return res.status(400).json({ message: "Multer Error", error: err })
            }
            const {
                gender,
                address,
                qualification,
                experienceYear,
                nursingCouncilRegNo,
                verificationStatus,
                rejectionReason,
                ApprovedBy,
                approvedAt,
                availabilityStatus,
                serviceRadius,
                ratingAverage,
                totalCompleteJobs,
                bankDetailes,
                specialization } = req.body

            const { error, isError } = checkEmpty({ gender, address, qualification, experienceYear, nursingCouncilRegNo, specialization })
            if (isError) {
                return res.status(400).json({ message: "All Fields Required", error })
            }
            let profilePhoto = ""
            if (req.files?.profilePhoto) {
                const { secure_url } = await cloudinary.uploader.upload(req.files?.profilePhoto[0].path)
                profilePhoto = secure_url
            }

            const uploadFile = async (file) => {
                if (!file) return ""
                const result = await cloudinary.uploader.upload(file[0].path, {
                    folder: 'documents'
                })
                return result.secure_url
            }
            const degreeCertificate = await uploadFile(req.files?.degreeCertificate)
            const nursingCouncilCertificate = await uploadFile(req.files?.nursingCouncilCertificate)
            const idProof = await uploadFile(req.files?.idProof)
            const addressProof = await uploadFile(req.files?.addressProof)


            if (!degreeCertificate || !nursingCouncilCertificate || !idProof || !addressProof) {
                return res.status(400).json({ message: "Upload Documents" })
            }
            const documents = {
                degreeCertificate,
                nursingCouncilCertificate,
                idProof,
                addressProof
            }

            await NurseProfile.create({
                nurseId: req.user,
                gender,
                address,
                profilePhoto,
                qualification,
                experienceYear,
                nursingCouncilRegNo,
                verificationStatus,
                rejectionReason,
                ApprovedBy,
                approvedAt,
                availabilityStatus,
                serviceRadius,
                ratingAverage,
                totalCompleteJobs,
                bankDetailes,
                specialization,
                documents
            })
            res.json({ message: "Nurses Info Fetched Successfully" })
        })
    } catch (error) {
        console.log('Error From : updateNurseInfo')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.updateNurseInfo = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer Error", error: err });
            }

            const isFound = await NurseProfile.findOne({ nurseId: req.user });
            if (!isFound) {
                return res.status(404).json({ message: "Nurse profile not found" });
            }

            const {
                name, mobile, gender, address, qualification, experienceYear,
                nursingCouncilRegNo, verificationStatus, rejectionReason,
                ApprovedBy, approvedAt, availabilityStatus, serviceRadius,
                ratingAverage, totalCompleteJobs, bankDetailes, specialization
            } = req.body;

            if (name || mobile) {
                await Auth.findByIdAndUpdate(req.user, { name, mobile });
            }

            let profilePhoto = isFound.profilePhoto;
            if (req.files?.profilePhoto) {
                if (isFound.profilePhoto) {
                    const publicId = isFound.profilePhoto.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                const { secure_url } = await cloudinary.uploader.upload(req.files.profilePhoto[0].path);
                profilePhoto = secure_url;
            }


            const uploadNew = async (newFile, oldUrl, folder = "documents") => {
                if (!newFile) return oldUrl; // no new file → keep existing
                // Delete old file from Cloudinary
                if (oldUrl) {
                    const publicId = `${folder}/` + oldUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                // Upload new file
                const result = await cloudinary.uploader.upload(newFile[0].path, { folder });
                return result.secure_url;
            };

            const documents = {
                degreeCertificate: await uploadNew(req.files?.degreeCertificate, isFound.documents?.degreeCertificate),
                nursingCouncilCertificate: await uploadNew(req.files?.nursingCouncilCertificate, isFound.documents?.nursingCouncilCertificate),
                idProof: await uploadNew(req.files?.idProof, isFound.documents?.idProof),
                addressProof: await uploadNew(req.files?.addressProof, isFound.documents?.addressProof),
            };

            await NurseProfile.findOneAndUpdate({ nurseId: req.user }, {
                gender, address, qualification, experienceYear,
                nursingCouncilRegNo, verificationStatus, rejectionReason,
                ApprovedBy, approvedAt, availabilityStatus, serviceRadius,
                ratingAverage, totalCompleteJobs, bankDetailes, specialization,
                profilePhoto,
                documents
            });

            return res.status(200).json({ message: "Nurse info updated successfully" });
        });
    } catch (error) {
        console.error("Error From: UpdateNurseInfo", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.suspendNurse = asyncHandler(async (req, res) => {
    try {
        await Auth.findByIdAndUpdate(req.params.nurseId || req.user, { isActive: false })
        res.json({ message: "Nurse Suspended Successfully" })
    } catch (error) {
        console.log('Error From : suspendNurse')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.approveNurse = asyncHandler(async (req, res) => {
    try {
        const { nurseId } = req.params
        const nurse = await NurseProfile.findOne({ nurseId: nurseId })
        if (!nurse) {
            return res.status(404).json({ message: "Nurse Not Found" })
        }

        if (nurse.verificationStatus === 'approved') {
            return res.status(400).json({ message: "Nurse Already Approved" })
        }

        await NurseProfile.findOneAndUpdate({ nurseId: nurseId },
            { verificationStatus: 'approved', ApprovedBy: req.user, approvedAt: new Date() })

        res.json({ message: "Nurse Approved Successfully" })

    } catch (error) {
        console.log('Error From : approveNurse')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.rejectNurse = asyncHandler(async (req, res) => {
    try {
        const { nurseId } = req.params
        const { rejectionReason } = req.body

        if (!rejectionReason) {
            return res.status(400).json({ message: "Rejection Reason Required" })
        }

        const nurse = await NurseProfile.findOne({ nurseId: nurseId })
        if (!nurse) {
            return res.status(404).json({ message: "Nurse Not Found" })
        }
        await NurseProfile.findOneAndUpdate({ nurseId: nurseId }, { verificationStatus: 'reject', rejectionReason })
        res.json({ message: "Nurse Rejected Successfully" })

    } catch (error) {
        console.log('Error From : rejectNurse')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.updateAvailability = asyncHandler(async (req, res) => {
    try {
        const { availabilityStatus } = req.body
        const validStatus = ['available', 'busy', 'off_duty']
        if (!validStatus.includes(availabilityStatus)) {
            return res.status(400).json({ message: "Invalid Availability Status" })
        }
        await NurseProfile.findOneAndUpdate({ nurseId: req.user }, { availabilityStatus })
        res.json({ message: "Availability Updated Successfully" })

    } catch (error) {
        console.log('Error From : updateAvailability')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.getPendingNurses = asyncHandler(async (req, res) => {
    try {
        const result = await NurseProfile.find({ verificationStatus: 'pending' }).populate('nurseId', 'name email mobile')
        res.json({ message: "Pending Nurses Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getPendingNurses')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

exports.updateNursePassword = asyncHandler(async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" })
        }

        const validator = require('validator')
        const bcrypt = require('bcryptjs')

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ message: "New password must be strong (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol)" })
        }

        const nurse = await Auth.findById(req.user)
        if (!nurse) {
            return res.status(404).json({ message: "Nurse Not Found" })
        }

        const verify = await bcrypt.compare(currentPassword, nurse.password)
        if (!verify) {
            return res.status(401).json({ message: "Invalid current password" })
        }

        const hash = await bcrypt.hash(newPassword, 10)
        await Auth.findByIdAndUpdate(req.user, { password: hash })

        res.json({ message: "Password updated successfully" })
    } catch (error) {
        console.log('Error From : updateNursePassword')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
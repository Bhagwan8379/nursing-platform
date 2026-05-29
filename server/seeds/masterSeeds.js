const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const Auth = require('../models/Auth');
const Service = require('../models/Service');
const NurseProfile = require('../models/NurseProfile');

// Import data from seed files
const users = require('../seeds/userSeeds');
const services = require('../seeds/serviceSeed');

dotenv.config({ path: path.join(__dirname, '../.env') });

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("🚀 Connection Successful. Cleaning old data...");

        // Clean existing data
        await Auth.deleteMany();
        await Service.deleteMany();
        await NurseProfile.deleteMany();

        // 1. Insert Services
        await Service.insertMany(services);
        console.log("✅ Services Seeded");

        // 2. Insert Users (With Password Hashing)
        for (let u of users) {
            const salt = await bcrypt.genSalt(10);
            u.password = await bcrypt.hash(u.password, salt);
            const createdUser = await Auth.create(u);

            // 3. Create Nurse Profiles for 'nurse' role users automatically
            if (createdUser.role === 'nurse') {
                await NurseProfile.create({
                    nurseId: createdUser._id,
                    gender: createdUser.name.includes("Amol") ? "male" : "female",
                    address: { street: "Main Colony", city: "Chhatrapati Sambhajinagar", state: "Maharashtra", pin: "431001" },
                    qualification: createdUser.name.includes("Snehal") ? "B.Sc Nursing" : "GNM",
                    experienceYear: Math.floor(Math.random() * 10) + 1,
                    nursingCouncilRegNo: `MNC-${Math.floor(100000 + Math.random() * 900000)}`,
                    documents: {
                        degreeCertificate: "https://via.placeholder.com/200",
                        nursingCouncilCertificate: "https://via.placeholder.com/200",
                        idProof: "https://via.placeholder.com/200",
                        addressProof: "https://via.placeholder.com/200"
                    },
                    verificationStatus: "approved",
                    availabilityStatus: "available",
                    specialization: "General Nursing"
                });
            }
        }
        console.log("✅ All Users & Nurse Profiles Seeded");

        console.log("✨ Seeding Complete!");
        process.exit();
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

runSeeder();
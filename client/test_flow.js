async function testFlow() {
    const email = `test_patient_${Date.now()}@carenest.com`;
    const password = "Password@123";
    const mobile = "9" + Math.floor(100000000 + Math.random() * 900000000); // Random 10-digit Indian mobile starting with 9
    
    console.log("------------------------------------------");
    console.log("CARENEST SYSTEM INTEGRATION TEST");
    console.log("------------------------------------------");
    console.log(`Generated Test Credentials: \nEmail: ${email}\nMobile: ${mobile}\nPassword: ${password}\n`);

    try {
        // 1. REGISTER CUSTOMER
        console.log("1. Sending Customer Registration Request...");
        const registerResponse = await fetch("http://localhost:5000/api/auth/register-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Patient",
                email: email,
                mobile: mobile,
                password: password
            })
        });
        
        const registerData = await registerResponse.json();
        console.log(`Registration Status Code: ${registerResponse.status}`);
        console.log("Response:", JSON.stringify(registerData, null, 2));
        
        if (registerResponse.status !== 200) {
            throw new Error(`Registration failed: ${registerData.message}`);
        }
        console.log("✅ Customer Registered Successfully!\n");

        // 2. LOGIN CUSTOMER
        console.log("2. Sending Customer Login Request...");
        const loginResponse = await fetch("http://localhost:5000/api/auth/login-patient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const loginData = await loginResponse.json();
        console.log(`Login Status Code: ${loginResponse.status}`);
        console.log("Response Profile:", JSON.stringify(loginData.result, null, 2));

        if (loginResponse.status !== 200) {
            throw new Error(`Login failed: ${loginData.message}`);
        }

        // Get cookie header
        const setCookieHeader = loginResponse.headers.get("set-cookie");
        console.log("Session Cookie Received:", setCookieHeader ? "Yes (customer cookie set)" : "No");
        console.log("✅ Customer Logged In Successfully!\n");

        // 3. FETCH SERVICES
        console.log("3. Fetching CareNest Service Catalog...");
        const serviceResponse = await fetch("http://localhost:5000/api/service/get-all-services");
        const serviceData = await serviceResponse.json();
        console.log(`Service Catalog Fetch Code: ${serviceResponse.status}`);
        console.log(`Available Services Count: ${serviceData.result ? serviceData.result.length : 0}`);

        let selectedService = null;
        if (serviceData.result && serviceData.result.length > 0) {
            selectedService = serviceData.result[0];
            console.log(`Selected Service for Booking: ${selectedService.name} (Price: ₹${selectedService.price})`);
        } else {
            throw new Error("No active services in catalog. Please seed or add services via the admin panel first.");
        }
        console.log("✅ Service Catalog Fetched Successfully!\n");

        // 4. CREATE A BOOKING
        console.log("4. Sending Service Booking Request...");
        const preferredDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Tomorrow
        
        const bookingResponse = await fetch("http://localhost:5000/api/booking/create-booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": setCookieHeader // Send session cookie to authenticate!
            },
            body: JSON.stringify({
                patientDetails: {
                    name: "John Doe Senior",
                    age: 65,
                    gender: "male",
                    bloodGroup: "O+",
                    weight: 72,
                    medicalHistory: "Knee replacement surgery recovery",
                    allergies: "None",
                    currentMedications: "Painkillers and calcium supplements",
                    emergencyContact: "9876543210"
                },
                serviceId: selectedService._id,
                serviceAddress: {
                    fullAddress: "Plot 42, Sector 12, Kharghar",
                    city: "Navi Mumbai",
                    state: "Maharashtra",
                    pinCode: "410210"
                },
                preferredDate: preferredDate,
                timeSlot: "morning", // matches enum: ['morning', 'afternoon', 'evening', 'night']
                nurseGenderPreference: "any",
                paymentMode: "online",
                totalAmount: selectedService.price,
                customerNote: "Patient needs assistance post knee replacement surgery."
            })
        });

        const bookingData = await bookingResponse.json();
        console.log(`Booking Status Code: ${bookingResponse.status}`);
        console.log("Booking Response:", JSON.stringify(bookingData, null, 2));

        if (bookingResponse.status !== 201) { // 201 Created
            throw new Error(`Booking creation failed: ${bookingData.message}`);
        }
        console.log("\n🎉 SUCCESS! CareNest Doorstep Care Booking Created Successfully!");
        console.log(`Booking Number: ${bookingData.bookingNumber}`);
        console.log("------------------------------------------");

    } catch (error) {
        console.error("❌ TEST FAILED:", error.message);
        console.log("------------------------------------------");
    }
}

testFlow();

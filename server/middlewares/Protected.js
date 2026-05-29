const jwt = require("jsonwebtoken")


exports.adminProtected = async (req, res, next) => {
    try {
        const { admin } = req.cookies

        if (!admin) {
            return res.status(401).json({ message: "Cookie Not Found" })
        }

        jwt.verify(admin, process.env.JWT_KEY, (error, decode) => {
            if (error) {
                console.log(error)
                return res.status(401).json({ message: "Invalid Token" })
            }
            req.user = decode.userId
            next()
        })


    } catch (error) {
        console.log("Error From : adminProtected")
        return res.status(500).json({ message: "Internal Server Error" })
    }
}



exports.nurseProtected = async (req, res, next) => {
    try {
        const { nurse } = req.cookies

        if (!nurse) {
            return res.status(401).json({ message: "Cookie Not Found" })
        }

        jwt.verify(nurse, process.env.JWT_KEY, (error, decode) => {
            if (error) {
                console.log(error)
                return res.status(401).json({ message: "Invalid Token" })
            }
            req.user = decode.userId
            next()
        })


    } catch (error) {
        console.log("Error From : nurseProtected")
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


exports.customerProtected = async (req, res, next) => {
    try {
        const { customer } = req.cookies

        if (!customer) {
            return res.status(401).json({ message: "Cookie Not Found" })
        }

        jwt.verify(customer, process.env.JWT_KEY, (error, decode) => {
            if (error) {
                console.log(error)
                return res.status(401).json({ message: "Invalid Token" })
            }
            req.user = decode.userId
            next()
        })


    } catch (error) {
        console.log("Error From : customerProtected")
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
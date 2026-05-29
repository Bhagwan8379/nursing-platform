const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()


const app = express()



app.use(cookieParser())
app.use(express.json())
const allowedOrigins = [
    process.env.LOCAL_URL,
    process.env.LIVE_URL,
    'http://localhost:5173',
    'http://localhost:5174',
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error(`CORS: Origin ${origin} not allowed`))
    },
    credentials: true
}))

// Handle preflight OPTIONS requests for all routes
app.options('*', cors())


app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/nurse', require('./routes/nurse.routes'))
app.use('/api/customer', require('./routes/customer.routes'))
app.use('/api/booking', require('./routes/booking.routes'))
app.use('/api/admin', require('./routes/admin.routes'))
app.use('/api/service', require('./routes/service.routes'))
app.use('/api/payment', require('./routes/payment.routes'))
app.use('/api/review', require('./routes/review.routes'))
app.use('/api/notification', require('./routes/notification.routes'))


app.use((req, res) => {
    res.status(404).json({ Message: "Route Not Found" })
}),


    app.use((err, req, res, next) => {
        console.log(error)
        res.status(500).json({ message: `SERVER ERROR ${err.message}` })
    })


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MONGO CONNECTED 🥭'))
    .catch(err => console.error("Database connection failure:", err))

if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT || 5000, console.log('Server Running 🏃‍♀️'))
}

module.exports = app
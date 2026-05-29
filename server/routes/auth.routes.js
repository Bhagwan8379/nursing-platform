const {
    nurseRegister,
    customerRegister,
    logoutAdmin,
    logoutNurse,
    logoutCustomer,
    loginAdmin,
    loginNurse,
    loginPatient } = require('../controllers/auth.controller')

const router = require('express').Router()



router

    .post('/register-nurse', nurseRegister)
    .post('/register-customer', customerRegister)

    .post('/login-admin', loginAdmin)
    .post('/login-nurse', loginNurse)
    .post('/login-patient', loginPatient)

    .post('/logout-admin', logoutAdmin)
    .post('/logout-nurse', logoutNurse)
    .post('/logout-customer', logoutCustomer)



module.exports = router
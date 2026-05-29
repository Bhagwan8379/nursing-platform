const {
    getCustomerInfo,
    updateCustomerInfo,
    updateCustomerPassword,
} = require('../controllers/customer.controller')
const { customerProtected } = require('../middlewares/Protected')

const router = require('express').Router()


    .get('/get-customer-info', customerProtected, getCustomerInfo)
    .put('/update-cutomer-info', customerProtected, updateCustomerInfo)
    .put('/update-password', customerProtected, updateCustomerPassword)


module.exports = router
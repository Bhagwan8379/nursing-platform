const {
    getAllServices,
    getSingleService,
} = require('../controllers/service.controller')

const router = require('express').Router()

    .get('/get-all-services', getAllServices)
    .get('/get-single-service/:serviceId', getSingleService)
router

module.exports = router
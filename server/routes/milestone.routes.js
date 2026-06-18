const { getAllMilestones } = require('../controllers/milestone.controller')
const router = require('express').Router()

router.get('/', getAllMilestones)

module.exports = router

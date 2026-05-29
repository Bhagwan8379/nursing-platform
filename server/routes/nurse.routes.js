const {
    suspendNurse,
    updateNurseInfo,
    updateNursePassword,
    getAllNurses,
    getPendingNurses,
    approveNurse,
    rejectNurse,
    getNurseInfo,
    createNurseInfo,
    updateAvailability
} = require('../controllers/nurse.controller')
const { nurseProtected } = require('../middlewares/Protected')

const router = require('express').Router()


router
    .get('/info-nurse-info', nurseProtected, getNurseInfo)
    .post('/create-nurse-info', nurseProtected, createNurseInfo)
    .put('/update-nurse-info', nurseProtected, updateNurseInfo)
    .put('/update-availability', nurseProtected, updateAvailability)
    .put('/update-password', nurseProtected, updateNursePassword)


module.exports = router
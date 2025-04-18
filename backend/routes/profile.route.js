const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile.controller')
const { requireAuth } = require('../middlewares/auth.middleware')

router.use(requireAuth)
router.get('/', profileController.getMyProfile)
router.get('/genders', profileController.getGenders)
router.put('/', profileController.updateMyProfile)
router.post('/upload-avatar', profileController.uploadAvatar)

module.exports = router

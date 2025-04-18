const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

// ✅ login/logout อยู่แล้ว
router.post('/login', auth.login);
router.post('/logout', auth.logout);

// ✅ เพิ่มอันนี้เข้าไปเลย
router.get('/verify', auth.verify);

module.exports = router;

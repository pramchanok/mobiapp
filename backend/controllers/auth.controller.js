const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signToken } = require('../utils/jwt');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.deleted_at) return res.status(401).json({ message: 'ไม่พบบัญชีนี้' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

    const token = signToken({ id: user.id, email: user.email });

    // ✅ ใส่ token ลง cookie (httpOnly)
    res.cookie('token', token, {
        httpOnly: true,      // ⛔ ป้องกัน JS ฝั่ง client อ่าน
        secure: false,       // ✅ ใช้ true เมื่อ deploy บน https
        sameSite: 'Strict',  // ป้องกัน CSRF
        maxAge: 24 * 60 * 60 * 1000 // 1 วัน (ms)
    });

    res.json({ message: 'เข้าสู่ระบบสำเร็จ' });

    // res.json({
    //     token,
    //     user: {
    //         id: user.id,
    //         name: user.name,
    //         email: user.email,
    //         role: user.role
    //     }
    // });
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'ออกจากระบบสำเร็จ' });
};

exports.verify = async (req, res) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: 'ไม่ได้ login' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { profile: true }
        })

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        })
    } catch (err) {
        res.status(401).json({ message: 'token หมดอายุหรือไม่ถูกต้อง' })
    }
}
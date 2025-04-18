const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.updateLocation = async (req, res) => {
    const { latitude, longitude } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const location = await prisma.location.upsert({
        where: { userId },
        update: { latitude, longitude },
        create: { userId, latitude, longitude },
    });

    // ✅ Emit ผ่าน socket ไปยังผู้ใช้คนอื่น
    req.io.emit("location:update", { userId, latitude, longitude });

    res.json(location);
};
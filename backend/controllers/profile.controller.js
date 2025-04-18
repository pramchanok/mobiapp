const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const busboy = require("busboy");
const sharp = require('sharp')
const prisma = new PrismaClient()

exports.getMyProfile = async (req, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user.id },
        })

        res.json(profile)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
}

exports.updateMyProfile = async (req, res) => {
    try {
        const data = req.body
        data.updatedBy = req.user.id

        const updated = await prisma.profile.upsert({
            where: { userId: req.user.id },
            create: {
                ...data,
                userId: req.user.id,
                createdBy: req.user.id,
            },
            update: data,
        })

        res.json({ message: '✅ อัปเดตสำเร็จ', profile: updated })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
}

exports.getGenders = async (req, res) => {
    try {
        const genders = await prisma.gender.findMany({
            where: {
                deletedAt: null
            },
            orderBy: { id: 'asc' }
        })

        res.json(genders)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
}

exports.uploadAvatar = (req, res) => {
    const bb = busboy({ headers: req.headers })
  
    bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
        
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(filename.mimeType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type' })
      }
  
      const chunks = []
      const fileName = `avatar-${Date.now()}.webp`
  
      file.on('data', (data) => {
        chunks.push(data)
      })
  
      file.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks)
  
          const resized = await sharp(buffer)
            .resize(150, 150)
            .sharpen()
            .webp({ quality: 90 })
            .toBuffer()
  
          const uploadDir = path.join(__dirname, '../', 'uploads', 'avatars', `${req.user.id}`)
          fs.mkdirSync(uploadDir, { recursive: true })
  
          const savePath = path.join(uploadDir, fileName)
          fs.writeFileSync(savePath, resized)
  
          const avatarUrl = `/uploads/avatars/${req.user.id}/${fileName}`
  
          await prisma.profile.update({
            where: { userId: req.user.id },
            data: {
              avatar: avatarUrl,
              updatedBy: req.user.id,
              updatedAt: new Date()
            }
          })
  
          return res.json({
            success: true,
            url: avatarUrl,
            message: 'อัปโหลดและบันทึกโปรไฟล์สำเร็จ'
          })
        } catch (error) {
          console.error('Image processing error:', error)
          return res.status(500).json({ success: false, message: 'Processing failed' })
        }
      })
    })
  
    bb.on('error', (err) => {
      console.error('Busboy error:', err)
      res.status(500).json({ success: false, message: 'Upload failed' })
    })
  
    req.pipe(bb)
  }


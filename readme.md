# 🐘 PostgreSQL Restore Guide (Windows + Remote Server)

psql -U postgres -h 103.91.204.124 -p 5432 -d Mobiapp -f "D:\backup\mobiapp_backup.sql"

ใช้สำหรับนำเข้าไฟล์ `.sql` ที่ได้จากการ `pg_dump` ไปยัง PostgreSQL ที่อยู่บน VPS (IP: `103.91.204.124`)

---

## ✅ ข้อกำหนด

- ต้องติดตั้ง PostgreSQL บน Windows
- mobiapp_backup.sql ได้จาก dummSql.bat
- ตรวจสอบว่า `psql.exe` อยู่ใน path หรือโฟลเดอร์นี้:



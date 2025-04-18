const express = require("express"); 
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const busboy = require("busboy");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pushRoutes = require('./routes/push.route');
const authRoutes = require('./routes/auth.route');
const profileRoutes = require('./routes/profile.route')

require('express-async-errors')

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/notify', pushRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((req, res, next) => {
    res.status(404).json({
        message: 'ไม่พบหน้า/เส้นทางที่คุณเรียก (404 Not Found)',
        path: req.originalUrl
    })
})

const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" },
    transports: ["websocket"]
});

// ✅ อัปโหลดไฟล์โดยใช้ Busboy และส่ง Progress แบบ Real-time
// app.post("/upload", (req, res) => {
//     const taskId = Date.now();
//     const socketId = req.headers["socket-id"];
//     const socket = io.sockets.sockets.get(socketId);

//     if (!socket) {
//         return res.status(400).json({ error: "Invalid socket connection" });
//     }

//     // ✅ ใช้ setImmediate() เพื่อให้ตอบ `202 Accepted` ก่อนเริ่มประมวลผล
//     setImmediate(() => {
//         res.status(202).json({ message: "📂 Upload started", taskId });
//     });

//     const bb = busboy({ headers: req.headers });
//     let bytesReceived = 0;
//     const totalSize = parseInt(req.headers["content-length"], 10);
//     let filePath = "";

//     bb.on("file", (fieldname, file, info) => {
//         const { filename } = info;
//         filePath = path.join(__dirname, "uploads", filename);
//         const fileStream = fs.createWriteStream(filePath);
//         file.pipe(fileStream);

//         file.on("data", (chunk) => {
//             bytesReceived += chunk.length;
//             let percentage = Math.round((bytesReceived / totalSize) * 100);
//             socket.emit("uploadProgress", { taskId, percentage });
//         });

//         fileStream.on("finish", () => {
//             console.log(`✅ File uploaded: ${filename}`);
//         });
//         // fileStream.on("finish", () => {
//         //     console.log(`✅ File uploaded: ${filename}`);
//         //     processTask(socket, taskId, filePath);
//         // });
//     });

//     bb.on("finish", () => {
//         console.log("🎉 Upload Complete!");
//         socket.emit("taskComplete", { taskId, message: "✅ Upload Complete!" });
//     });

//     req.pipe(bb);
// });

// ✅ เก็บสถานะอัปโหลดของแต่ละ Task
const uploadsStatus = {};

app.put("/upload", (req, res) => {
    const taskId = Date.now();
    const socketId = req.headers["socket-id"];
    const socket = io.sockets.sockets.get(socketId);

    if (!socket) {
        return res.status(400).json({ error: "Invalid socket connection" });
    }

    // ✅ ตอบ `202 Accepted` ทันทีและตัดการเชื่อมต่อ Request
    // res.status(202).json({ message: "📂 Upload started", taskId });
    console.log("✅ Responded 202 Accepted, processing file...");


    // ✅ ตั้งค่าสถานะอัปโหลด
    uploadsStatus[taskId] = { status: "uploading", fileName: "" };

    const bb = busboy({ headers: req.headers });
    let bytesReceived = 0;
    const totalSize = parseInt(req.headers["content-length"], 10);
    let filePath = "";

    bb.on("file", (fieldname, file, info) => {
        const { filename } = info;
        filePath = path.join(__dirname, "uploads", filename);
        uploadsStatus[taskId].fileName = filename;

        const fileStream = fs.createWriteStream(filePath);
        file.pipe(fileStream);

        file.on("data", (chunk) => {
            bytesReceived += chunk.length;
            let percentage = Math.round((bytesReceived / totalSize) * 100);
            socket.emit("uploadProgress", { taskId, percentage, bytesReceived });
        });

        fileStream.on("finish", () => {
            console.log(`✅ File uploaded: ${filename}`);
        });
    });

    bb.on("finish", () => {
        console.log("🎉 Upload Complete!");
        uploadsStatus[taskId].status = "completed";
        socket.emit("uploadComplete", {
            taskId,
            message: "✅ File uploaded successfully",
            fileName: path.basename(filePath),
            status: 200,
        });

        // ✅ ตอบกลับ HTTP 200 หลังอัปโหลดเสร็จ
        res.status(200).json({
            taskId,
            message: "✅ File uploaded successfully",
            fileName: path.basename(filePath),
        });
    });

    req.pipe(bb);
});

app.post("/upload-test", (req, res) => {
    const taskId = Date.now();
    const socketId = req.headers["socket-id"];
    const socket = io.sockets.sockets.get(socketId);

    if (!socket) {
        return res.status(400).json({ error: "Invalid socket connection" });
    }

    // ✅ ตอบ `202 Accepted` ทันที
    res.status(202).json({ message: "📂 Upload started", taskId });

    console.log("✅ Responded 202 Accepted, processing file...");

    // ✅ ตั้งค่าสถานะอัปโหลด
    uploadsStatus[taskId] = { status: "uploading", fileName: "" };

    const bb = busboy({ headers: req.headers });
    let bytesReceived = 0;
    const totalSize = parseInt(req.headers["content-length"], 10);
    let filePath = "";

    bb.on("file", (fieldname, file, info) => {
        const { filename } = info;
        filePath = path.join(__dirname, "uploads", filename);
        uploadsStatus[taskId].fileName = filename;

        const fileStream = fs.createWriteStream(filePath);

        // ✅ ทำให้ Stream ช้าลง โดยดีเลย์การเขียนทีละ 500ms (0.5 วินาที)
        const slowStream = new (require("stream").Transform)({
            transform(chunk, encoding, callback) {
                setTimeout(() => {
                    this.push(chunk);
                    bytesReceived += chunk.length;
                    let percentage = Math.round((bytesReceived / totalSize) * 100);
                    socket.emit("uploadProgress", { taskId, percentage, bytesReceived });
                    callback();
                }, 500); // ✅ ดีเลย์ 500ms ต่อ Chunk
            }
        });

        file.pipe(slowStream).pipe(fileStream);

        fileStream.on("finish", () => {
            console.log(`✅ File uploaded: ${filename}`);
        });
    });

    bb.on("finish", () => {
        console.log("🎉 Upload Complete!");

        // ✅ จำลองการประมวลผลที่ใช้เวลา 30 วิ
        setTimeout(() => {
            uploadsStatus[taskId].status = "completed";
            socket.emit("uploadComplete", {
                taskId,
                message: "✅ File uploaded successfully",
                fileName: path.basename(filePath),
                status: 200,
            });
            console.log("✅ File processing completed after 30 seconds.");
        }, 30000); // ✅ ดีเลย์ 30 วินาที ก่อนบอกว่าอัปโหลดเสร็จ
    });

    req.pipe(bb);
});

// ✅ API ให้ Client เช็คสถานะอัปโหลด
app.get("/upload-status", (req, res) => {
    const taskId = req.query.taskId;

    if (!uploadsStatus[taskId]) {
        return res.status(404).json({ error: "Task not found" });
    }

    if (uploadsStatus[taskId].status === "completed") {
        return res.status(200).json({
            message: "✅ Upload Completed",
            fileName: uploadsStatus[taskId].fileName,
        });
    } else {
        return res.status(202).json({ message: "📂 Uploading..." });
    }
});

// ✅ ฟังก์ชันประมวลผลไฟล์หลังจากอัปโหลดเสร็จ
const processTask = (socket, taskId, filePath) => {
    try {
        const totalSize = fs.statSync(filePath).size;
        let bytesRead = 0;

        const stream = fs.createReadStream(filePath, { highWaterMark: 1024 * 50 });

        stream.on("data", (chunk) => {
            bytesRead += chunk.length;
            let percentage = Math.min(Math.round((bytesRead / totalSize) * 100), 100);
            socket.emit("processingProgress", { taskId, percentage });
        });

        stream.on("end", () => {
            socket.emit("processingProgress", { taskId, percentage: 100 });
            socket.emit("taskComplete", { taskId, message: "✅ Processing Complete!" });
            console.log(`📂 File ${filePath} processed successfully.`);
        });

        stream.on("error", (err) => {
            console.error("❌ Error processing file:", err);
            socket.emit("taskError", { taskId, error: err.message });
        });

    } catch (error) {
        console.error("❌ Error accessing file:", error);
        socket.emit("taskError", { taskId, error: "File not found or corrupted." });
    }
};

// Handle WebSocket Connection
io.on("connection", (socket) => {
    console.log("⚡ A user connected:", socket.id);
    socket.emit("connected", { socketId: socket.id });

    socket.on('share-location', (data) => {
        console.log('📍 Received location:', data)
        socket.broadcast.emit('user-location', {
            userId: socket.id, // หรือ auth.id ถ้ามี login
            ...data
        })
    })

    socket.on('location:send', (data) => {
        console.log('📍 Received location:', data);
        socket.broadcast.emit('location:update', data); // ส่งต่อให้คนอื่น
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected");
    });
});

// 🔴 Error handler
app.use((err, req, res, next) => {
    console.error('🔥 Caught error:', err)
    res.status(500).json({ message: 'Internal server error' })
})

server.listen(3000, () => console.log("🚀 Server is running on port 3000"));

<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-sheet width="500" class="pa-5 rounded-lg elevation-10">
            <v-card-title class="text-h5 text-center font-weight-bold">
                📂 Upload & Processing File
            </v-card-title>

            <v-card-text>
                <v-file-input
                    label="เลือกไฟล์"
                    prepend-icon="mdi-upload"
                    variant="outlined"
                    rounded
                    density="comfortable"
                    hide-details
                    class="mt-3"
                    @change="handleFileUpload"
                />

                <v-progress-linear
                    :value="progress"
                    :buffer-value="progress"
                    color="primary"
                    height="15"
                    striped
                    rounded
                    class="mt-4"
                >
                    <strong>{{ progress }}%</strong>
                </v-progress-linear>

                <v-alert
                    v-if="uploadSpeed > 0"
                    type="info"
                    variant="tonal"
                    class="mt-4"
                >
                    🚀 ความเร็วอัปโหลด: {{ formattedSpeed }}
                </v-alert>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn
                    color="primary"
                    variant="flat"
                    class="px-5"
                    rounded
                    @click="resetProgress"
                >
                    รีเซ็ต
                </v-btn>
            </v-card-actions>
        </v-sheet>
    </v-container>
</template>

<script>
import socket from "@/plugins/socket";
import api from "@/plugins/axios";
import { useToaster } from '@/composables/useToaster';
const { success, error } = useToaster();

export default {
    data() {
        return {
            socketId: "",
            progress: 0,
            uploadSpeed: 0,
            startTime: null,
            lastBytes: 0,
            taskId: null
        };
    },
    computed: {
        formattedSpeed() {
            return this.uploadSpeed >= 1024
                ? `${(this.uploadSpeed / 1024).toFixed(2)} MB/s`
                : `${this.uploadSpeed.toFixed(2)} KB/s`;
        }
    },
    created() {
        socket.on("connected", (data) => {
            this.socketId = data.socketId;
        });

        socket.on("uploadProgress", (data) => {
            this.progress = data.percentage;
            const elapsedTime = (Date.now() - this.startTime) / 1000;
            if (elapsedTime > 0) {
                const bytesUploaded = data.bytesReceived - this.lastBytes;
                this.uploadSpeed = bytesUploaded / elapsedTime;
                this.lastBytes = data.bytesReceived;
            }
        });

        socket.on("uploadComplete", (data) => {
            // console.log("✅ Upload Complete:", data);
            this.progress = 100;
            this.uploadSpeed = 0;
            // this.checkUploadStatus();
        });
    },
    methods: {
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) {
                error("❌ No file selected!");
                return;
            }

            this.progress = 0;
            this.uploadSpeed = 0;
            this.startTime = Date.now();
            this.lastBytes = 0;

            const formData = new FormData();
            formData.append("file", file);

            // ✅ ใช้ `setTimeout()` เพื่อให้ Axios ปล่อย Request ทันที
            setTimeout(async () => {
                try {
                    const response = await api.put("/upload", formData, {
                        headers: {
                            "socket-id": this.socketId,
                            "Content-Type": "multipart/form-data"
                        },
                        timeout: 0, // ✅ ป้องกัน Timeout
                        maxRedirects: 0 // ✅ ป้องกันการรอ Redirect
                    });
                    // console.log(response);
                    
                    if (response.status === 200) {
                        success("📂 Upload started...");
                        this.taskId = response.data.taskId;
                    }
                } catch (error) {
                    error(`❌ Upload failed: ${error.message}`);
                }
            }, 0);
        },
        async checkUploadStatus() {
            let response;
            do {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                response = await api.get(
                    `/upload-status?taskId=${this.taskId}`
                );
            } while (response.status !== 200);
            alert(`📂 ไฟล์ ${response.data.fileName} อัปโหลดสำเร็จ! 🎉`);
        }
    }
};
</script>

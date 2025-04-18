<template>
    <v-card class="pa-4 profile-card">
        <!-- Avatar พร้อมไอคอนกล้อง -->
        <div class="avatar-wrapper d-flex justify-center mb-4">
            <v-avatar class="mb-4" size="150">
                <img
                    :lazy-src="previewUrl || userStore.user.profile.avatar"
                    :src="previewUrl || userStore.user.profile.avatar"
                    alt="avatar"
                />
            </v-avatar>
            <v-icon
                class="camera-icon"
                color="primary"
                small
                @click="triggerFileInput"
            >
                mdi-camera
            </v-icon>
            <input
                ref="inputRef"
                type="file"
                accept="image/*"
                class="d-none"
                @change="handleFileChange"
            />
        </div>

        <div class="text-h6">{{ userStore.user.name }}</div>
        <div class="text-caption">Super Supervisor</div>

        <v-row class="mt-4" dense>
            <v-col cols="6">
                <v-btn
                    color="primary"
                    variant="tonal"
                    block
                    @click="handleEditProfile"
                >
                    💾 แก้ไขข้อมูลส่วนตัว
                </v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn
                    color="error"
                    variant="tonal"
                    block
                    @click="handleLogout"
                >
                    🚪 ออกจากระบบ
                </v-btn>
            </v-col>
        </v-row>
    </v-card>

    <!-- Dialog สำหรับ Crop รูป -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-card>
            <v-card-title class="text-h6">ครอบรูปภาพโปรไฟล์</v-card-title>

            <!-- ✅ Progress bar -->
            <v-progress-linear
                v-if="uploading"
                :value="uploadProgress"
                height="6"
                color="primary"
                striped
                rounded
                class="mb-1"
            >
                <template #default>
                    <strong>{{ uploadProgress }}%</strong>
                </template>
            </v-progress-linear>

            <v-card-text>
                <Cropper
                    ref="cropperRef"
                    class="cropper"
                    :src="image"
                    :stencil-props="{ aspectRatio: 1 }"
                    :resizeImage="true"
                    :transitions="false"
                    :canvas="{ height: 150, width: 150 }"
                />
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn
                    variant="tonal"
                    color="error"
                    text
                    @click="dialog = false"
                    :disabled="uploading"
                >
                    ยกเลิก
                </v-btn>
                <v-btn
                    variant="tonal"
                    color="success"
                    @click="cropImage"
                    :loading="uploading"
                    :disabled="uploading"
                >
                    บันทึก
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <ConfirmDialog
        v-model="showConfirm"
        title="ออกจากระบบ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?"
        @confirm="doLogout"
    />
</template>

<script setup>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const router = useRouter();
const userStore = useUserStore();
const { logout } = useLogout();
const { success } = useToaster();

const showConfirm = ref(false);
const image = ref(null);
const croppedBlob = ref(null);
const previewUrl = ref(null);
const cropperRef = ref(null);
const inputRef = ref(null);
const dialog = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);

const triggerFileInput = () => {
    inputRef.value?.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    image.value = null;

    const reader = new FileReader();
    reader.onload = () => {
        image.value = reader.result;
        dialog.value = true; // เปิด cropper dialog
    };
    reader.readAsDataURL(file);
};

const cropImage = async () => {
    const result = cropperRef.value.getResult({
        size: { width: 150, height: 150 },
        mime: "image/jpeg",
        image: true
    });

    if (!result || !result.canvas) return;

    const blob = await new Promise((resolve) =>
        result.canvas.toBlob(resolve, "image/jpeg", 0.9)
    );

    croppedBlob.value = blob;
    
    await uploadImage();
};

const uploadImage = async () => {
    if (!croppedBlob.value) return;

    const formData = new FormData();
    formData.append("file", croppedBlob.value, "avatar.jpg");

    try {
        uploading.value = true;
        uploadProgress.value = 0;

        const response = await axios.post("/profile/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    uploadProgress.value = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                }
            }
        });
        previewUrl.value = URL.createObjectURL(croppedBlob.value);

        success("✅ อัปโหลดเรียบร้อย!");
        dialog.value = false;
        console.log("response:", response.data);
    } catch (err) {
        console.error("upload error:", err);
    } finally {
        uploading.value = false;
        uploadProgress.value = 0;
    }
};

const handleLogout = () => {
    showConfirm.value = true;
};

const doLogout = async () => {
    await logout();
};

const handleEditProfile = () => {
    router.push("/profile");
};
</script>

<style scoped>
.avatar-wrapper {
    position: relative;
    width: fit-content;
    margin: 0 auto;
}

.camera-icon {
    position: absolute;
    bottom: 4px;
    right: 0;
    background-color: white;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.d-none {
    display: none;
}

.cropper {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
}
</style>

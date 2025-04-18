<template>
    <div>
        <v-card class="rounded-xl elevation-4">
            <v-card-title>👤 แก้ไขข้อมูลส่วนตัว</v-card-title>
            <v-divider />
            <v-card-text>
                <v-form ref="formRef" @submit.prevent="submitForm">
                    <v-text-field
                        v-model="formData.name"
                        label="ชื่อเต็ม"
                        :rules="[rules.required]"
                    >
                        <template v-slot:label>
                            ชื่อเต็ม <span class="text-error">*</span>
                        </template>
                    </v-text-field>

                    <v-select
                        v-model="formData.genderId"
                        :items="genders"
                        item-title="name"
                        item-value="id"
                        label="เพศ"
                        :rules="[rules.required]"
                    >
                        <template v-slot:label>
                            เพศ <span class="text-error">*</span>
                        </template>
                    </v-select>

                    <v-text-field
                        v-model="formData.phone"
                        label="เบอร์โทรศัพท์"
                        :rules="[rules.required, rules.phone]"
                    >
                        <template v-slot:label>
                            เบอร์โทรศัพท์ <span class="text-error">*</span>
                        </template>
                    </v-text-field>

                    <v-textarea
                        v-model="formData.address"
                        label="ที่อยู่"
                        :rules="[rules.required]"
                    >
                        <template v-slot:label>
                            ที่อยู่ <span class="text-error">*</span>
                        </template>
                    </v-textarea>

                    <!-- <v-text-field v-model="formData.position" label="ตำแหน่ง" /> -->
                    <!-- <v-text-field v-model="formData.department" label="แผนก" /> -->

                    <v-text-field v-model="formData.lineId" label="LINE ID" />
                    <v-text-field
                        v-model="formData.facebook"
                        label="Facebook URL"
                        :rules="[rules.facebook]"
                    />

                    <v-date-picker
                        v-model="formData.birthdate"
                        label="วันเกิด"
                        :max="maxDate"
                    />

                    <v-col class="d-flex justify-center">
                        <v-col cols="12" lg="2" md="3">
                            <v-btn
                                variant="tonal"
                                class="mt-4"
                                type="submit"
                                color="primary"
                                block
                            >
                                💾 บันทึกข้อมูล
                            </v-btn>
                        </v-col>
                    </v-col>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { success, error } = useToaster();

const formRef = ref();

const formData = ref({
    name: "",
    genderId: null,
    birthdate: "",
    phone: "",
    address: "",
    position: "",
    department: "",
    lineId: "",
    facebook: ""
});

const genders = ref([]);
const maxDate = new Date().toISOString().split("T")[0];

// ✅ Rules สำหรับ Validation
const rules = {
    required: (v) => !!v || "กรุณากรอกข้อมูล",
    phone: (v) =>
        !v || /^0[689]\d{8}$/.test(v) || "เบอร์โทรไม่ถูกต้อง (ต้องมี 10 หลัก)",
    facebook: (v) =>
        !v || v.startsWith("http") || "Facebook ต้องเป็น URL ที่ถูกต้อง"
};

const submitForm = async () => {
    const { valid } = await formRef.value.validate();

    if (!valid) {
        error("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
        focusFirstInvalid();
        return;
    }

    updateProfile();
};

const updateProfile = async () => {
    try {
        await axios.put("/profile", formData.value);
        success("✅ บันทึกข้อมูลสำเร็จ");
    } catch (err) {
        error("❌ บันทึกไม่สำเร็จ");
    }
};

const loadProfile = async () => {
    try {
        const res = await axios.get("/profile");
        formData.value = res.data;
    } catch (err) {
        error("❌ โหลดข้อมูลไม่สำเร็จ");
    }
};

const loadGenders = async () => {
    try {
        const res = await axios.get("/profile/genders");
        genders.value = res.data;
    } catch (err) {
        error("❌ โหลดรายการเพศไม่สำเร็จ");
    }
};

onMounted(() => {
    loadProfile();
    loadGenders();
});
</script>

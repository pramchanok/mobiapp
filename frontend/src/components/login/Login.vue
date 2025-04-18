<template>
    <v-card class="login-card">
        <v-card-title class="text-h5 text-center">เข้าสู่ระบบ</v-card-title>
        <v-card-text>
            <v-form @submit.prevent="handleLogin">
                <v-text-field
                    v-model="email"
                    label="อีเมล"
                    type="email"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    label="รหัสผ่าน"
                    type="password"
                    required
                ></v-text-field>
                <v-btn class="mt-4" color="primary" type="submit" block
                    >เข้าสู่ระบบ</v-btn
                >
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";
import { useToaster } from "@/composables/useToaster";
// import { useAuthStore } from "@/stores/auth";

// const auth = useAuthStore();
const { success, error } = useToaster();

const email = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {
    if (!email.value || !password.value) {
        error("❌ กรุณากรอกอีเมลและรหัสผ่าน");
        return;
    }

    try {
        const res = await axios.post("/auth/login", {
            email: email.value,
            password: password.value
        });
        // auth.login(res.data.token, res.data.user);
        // localStorage.setItem("token", res.data.token);
        success("เข้าสู่ระบบสําเร็จ");
        router.push("/");
    } catch (err) {
        error(`เข้าสู่ระบบไม่สําเร็จ ${err.response.data.message || ""}`);
        console.error(err);
    }
};
</script>

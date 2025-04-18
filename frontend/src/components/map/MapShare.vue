<template>
    <div>
        <h2>📍 แชร์ตำแหน่ง</h2>
        <p>ตำแหน่งของคุณ: {{ location.lat }}, {{ location.lng }}</p>
        <ul>
            <li v-for="user in otherUsers" :key="user.id">
                👥 {{ user.name || user.id }}: {{ user.lat }}, {{ user.lng }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import socket from "@/plugins/socket";

const location = ref({ lat: null, lng: null });
const otherUsers = ref([]);

onMounted(() => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                location.value = { lat: latitude, lng: longitude };

                // ส่งพิกัดของเราไปยัง server
                socket.emit("shareLocation", {
                    lat: latitude,
                    lng: longitude,
                    name: "Toktak"
                });
            },
            (err) => {
                console.error("📵 ไม่สามารถเข้าถึงตำแหน่ง:", err);
            }
        );
    }

    socket.on("userLocation", (data) => {
        const existing = otherUsers.value.find((u) => u.id === data.id);
        if (existing) {
            Object.assign(existing, data);
        } else {
            otherUsers.value.push(data);
        }
    });

    socket.on("userDisconnected", (id) => {
        otherUsers.value = otherUsers.value.filter((u) => u.id !== id);
    });
});
</script>

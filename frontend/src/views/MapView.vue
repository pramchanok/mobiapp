<template>
    <div>
        <v-card class="rounded-xl elevation-4">
            <v-card-title>📍 ตำแหน่งสมาชิก</v-card-title>
            <v-divider />
            <v-card-text>
                <div id="map" style="height: 700px; border-radius: 12px"></div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import socket from "@/plugins/socket";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const userStore = useUserStore();
let map;
let myMarker;
const markers = {}; // ✅ สำหรับเก็บ marker ของสมาชิกคนอื่น

onMounted(() => {
    // ✅ 1. สร้างแผนที่
    map = L.map("map").setView([13.7563, 100.5018], 13);

    // ✅ 2. เพิ่ม Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // ✅ 3. แสดงตำแหน่งตัวเอง + แชร์ผ่าน socket
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // ✅ ถ้ายังไม่มี marker ตัวเอง → สร้าง
            if (!myMarker) {
                myMarker = L.marker([latitude, longitude], {
                    icon: L.icon({
                        iconUrl:
                            userStore.user.profile.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png", // ✅ ไอคอนสำหรับตัวเอง
                        iconSize: [40, 40],
                        iconAnchor: [20, 40]
                    })
                }).addTo(map);

                map.setView([latitude, longitude], 15);
            } else {
                myMarker.setLatLng([latitude, longitude]);
            }

            // ✅ ส่งตำแหน่งตัวเองไปยัง server
            socket.emit("location:send", {
                userId: userStore.user?.id,
                avatar:
                    userStore.user.profile.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                latitude,
                longitude
            });
        },
        (err) => {
            console.error("📵 ไม่สามารถแชร์ตำแหน่งได้", err);
        },
        { enableHighAccuracy: true }
    );

    // ✅ 4. ฟังตำแหน่งของสมาชิกคนอื่น
    socket.on("location:update", ({ userId, latitude, longitude, avatar }) => {
        if (userId === userStore.user?.id) return; // ❌ ข้ามตัวเอง

        if (markers[userId]) {
            markers[userId].setLatLng([latitude, longitude]);
        } else {
            markers[userId] = L.marker([latitude, longitude], {
                icon: L.icon({
                    iconUrl:
                        avatar ||
                        "https://cdn-icons-png.flaticon.com/512/1946/1946429.png", // ✅ ไอคอนสมาชิกคนอื่น
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                })
            }).addTo(map);
        }
    });
});
</script>

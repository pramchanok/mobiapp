<!-- 📁 src/views/DashboardView.vue -->
<template>
    <div>
        <v-card class="pa-4 welcome-card">
            <v-card-title class="text-h5">🎉 ยินดีต้อนรับ Toktak!</v-card-title>
            <v-card-text>
                คุณสามารถจัดการข้อมูลผู้ใช้ ดูรายงาน
                และควบคุมระบบทั้งหมดจากที่นี่ได้เลย
            </v-card-text>
        </v-card>

        <v-row class="mt-4">
            <v-col cols="12" md="6">
                <v-card class="quick-card">
                    <v-card-title>👥 ผู้ใช้งาน</v-card-title>
                    <v-card-text>100 คน</v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="quick-card">
                    <v-card-title>📊 รายงาน</v-card-title>
                    <v-card-text>ดูสถิติล่าสุด</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

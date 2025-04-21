<!-- 📁 layouts/DashboardLayout.vue -->
<template>
    <v-container class="dashboard-container" fluid>
        <v-row>
            <!-- ฝั่งซ้าย -->
            <v-col cols="12" md="4">
                <UserProfileCard />
            </v-col>

            <!-- ฝั่งขวา เปลี่ยนตาม route -->
            <v-col cols="12" md="8">
                <router-view v-slot="{ Component, route }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" :key="route.fullPath" />
                    </transition>
                </router-view>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import UserProfileCard from "@/components/dashboard/UserProfileCard.vue";

onMounted(() => {
    subscribeUser();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

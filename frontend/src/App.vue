<template>
    <v-app>
        <NavigationBar v-if="userStore && userStore.user" />

        <v-main>
            <!-- ✅ ใช้ transition สลับหน้า -->
            <!-- <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view> -->
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
// import { onMounted } from "vue";
// import { subscribeUser } from "@/utils/push";
const userStore = useUserStore();

onMounted(() => {
    subscribeUser();
});
</script>

<style scoped>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>

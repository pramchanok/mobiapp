<template>
    <div>
        <!-- ✅ App Bar -->
        <v-app-bar flat color="white" class="elevation-1 bar-space">
            <!-- <v-toolbar-title class="font-weight-bold"><v-icon class="cursor-pointer">mdi-home-outline</v-icon></v-toolbar-title> -->
            <v-toolbar-title class="font-weight-bold"
                ><v-btn
                    to="/"
                    text
                    width="150"
                    class="font-weight-bold d-flex align-center"
                    style="font-size: 20px"
                >
                    <v-icon class="mr-2">mdi-home-outline</v-icon>
                    My PWA
                </v-btn></v-toolbar-title
            >
            <v-btn
                to="/map"
                text
                class="ml-2 font-weight-bold d-flex align-center"
                style="font-size: 16px"
            >
                <v-icon class="mr-1">mdi-map</v-icon>
                แผนที่
            </v-btn>

            <!-- <router-link to="/" class="ml-3 text-decoration-none">
                <v-toolbar-title class="font-weight-bold d-flex align-right">
                    <v-icon class="mr-2">mdi-home-outline</v-icon>My PWA
                </v-toolbar-title>
            </router-link> -->
            <v-spacer />
            <v-btn icon @click="handleLogout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- ✅ Progress bar -->
        <v-progress-linear
            v-if="progress"
            color="primary"
            height="3"
            indeterminate
            absolute
            top
        />
    </div>
    <ConfirmDialog
        v-model="showConfirm"
        title="ออกจากระบบ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?"
        @confirm="doLogout"
    />
</template>

<script setup>
const router = useRouter();
const userStore = useUserStore();
const { logout } = useLogout();

const showConfirm = ref(false);
const progress = ref(false);

router.beforeEach(() => {
    progress.value = true;
});

router.afterEach(() => {
    setTimeout(() => {
        progress.value = false;
    }, 200);
});

const handleLogout = () => {
    showConfirm.value = true;
};

const doLogout = async () => {
    await logout();
};
</script>

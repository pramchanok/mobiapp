import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        // ✅ Layout หลักที่มี Sidebar ถาวร
        path: '/',
        component: () => import('@/layout/DashboardLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/DashboardView.vue')
            },
            {
                path: 'profile',
                name: 'ProfileEditView',
                component: () => import('@/views/ProfileEditView.vue')
            },
            {
                path: '/map',
                name: 'MapView',
                component: () => import('@/views/MapView.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// ✅ Middleware ตรวจ token ใน localStorage
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const userStore = useUserStore()

    if (!requiresAuth) return next()

    if (userStore.user) return next()

    try {
        const res = await axios.get('/auth/verify')
        userStore.user = res.data.user
        next()
    } catch (err) {
        next('/login')
    }
})

export default router
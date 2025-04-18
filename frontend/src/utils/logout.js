// ✅ ต้องเขียนแบบนี้
export function useLogout() {
    // const router = useRouter()
    const userStore = useUserStore()
    const { success, error } = useToaster()

    const logout = async () => {
        try {
            await axios.post("/auth/logout")
            userStore.clearUser()
            success("👋 ออกจากระบบแล้ว")
            
            // await router.push("/login")
            window.location.href = "/login"
        } catch (err) {
            error("❌ Logout ไม่สำเร็จ")
        }
    }

    return { logout }
}

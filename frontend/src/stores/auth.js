import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null,
    }),
    actions: {
        login(token, user) {
            this.token = token
            this.user = user
        },
        logout() {
            this.token = null
            this.user = null
        }
    }
})

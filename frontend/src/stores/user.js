// import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(payload) {
      this.user = payload
    },
    clearUser() {
      this.user = null
    }
  }
})

// 📁 src/utils/push.js
import api from "@/plugins/axios";

export async function subscribeUser() {
    if (!('serviceWorker' in navigator)) {
        console.warn("❌ This browser doesn't support service workers");
        return;
    }

    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.warn('❌ Notification permission denied');
        return;
    }

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY) // 🔐 ใช้ public key ของ Toktak
    });

    await api.post("/notify/subscribe", JSON.stringify(subscription), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log('✅ Subscribed to push notifications');
}

// Helper function
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

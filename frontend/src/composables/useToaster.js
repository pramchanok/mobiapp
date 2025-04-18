import { useToast } from 'vue-toastification';

const toast = useToast();

// 🎯 Default global options
const defaultOptions = {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
};

// 🎯 Default messages
const defaultMessages = {
    success: '✅ สำเร็จ',
    error: '❌ เกิดข้อผิดพลาด',
    info: 'ℹ️ แจ้งเตือน',
    warning: '⚠️ คำเตือน',
};

export function useToaster(customDefaults = {}, customMessages = {}) {
    const baseOptions = { ...defaultOptions, ...customDefaults };
    const messages = { ...defaultMessages, ...customMessages };

    const createToast = (type) => (message = '', options = {}) => {
        toast.clear();
        const finalMessage = message || messages[type];
        toast[type](finalMessage, { ...baseOptions, ...options });
    };

    return {
        success: createToast('success'),
        error: createToast('error'),
        info: createToast('info'),
        warning: createToast('warning'),
    };
}

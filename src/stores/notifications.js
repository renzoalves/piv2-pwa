import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notificationsData', {
    state: () => ({
        notifications: document.cookie.match("(^|;)\\s*notifications\\s*=\\s*([^;]+)")?.pop() != undefined ? JSON.parse(document.cookie.match("(^|;)\\s*notifications\\s*=\\s*([^;]+)")?.pop()) : ""
            
    }),
});
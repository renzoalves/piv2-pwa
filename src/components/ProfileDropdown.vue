<template>

    <div class="dropdown-wrapper">

        <div v-if="notificationsStore.notifications != ''" class="notifications-indicator">{{notificationsStore.notifications.length}}</div>

        <div class="toggle-wrapper">

            <span class="name">Olá, {{ userStore.user.name }}</span>
            
            <button class="dropdown-toggle" @click="toggleDropdown = !toggleDropdown">
        
                <IconifyIcon icon="ph:user"/>
                
            </button>

        </div>


        <div class="dropdown-options" :class="{show: toggleDropdown}">
            <slot class="options-item"></slot>

        </div>

    </div>

</template>

<script setup>

    import { useAuthStore } from "@/stores/user";
    import { ref } from "vue";
    import { useNotificationStore } from "@/stores/notifications";

    const userStore = useAuthStore();
    const notificationsStore = useNotificationStore();

    const toggleDropdown = ref(false);

    const allNotifications = ref('');

    allNotifications.value = document.cookie.match("(^|;)\\s*notifications\\s*=\\s*([^;]+)")?.pop() || "";

    if(allNotifications.value != ''){
        allNotifications.value = JSON.parse(allNotifications.value);
    }

</script>

<style scoped lang="less">

    .dropdown-wrapper {

        position: relative;

        .notifications-indicator{
            position: absolute;
            bottom: -5px;
            right: 5px;
            color: #FFF;
            padding: 5px;
            background: red;
            border-radius: 50%;
            font-size: 12px;
            width: 10px;
            height: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .toggle-wrapper{
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .dropdown-toggle{
            display: flex;
            gap: 10px;
            font-size: 16px;
            align-items: center;
            border: none;
            background: none;
            outline: none;
            color: @primaryGray;
            cursor: pointer;
    
            .iconify{
                color: @primaryBlue;
                font-size: 30px;
                padding: 5px;
                border: 1px solid @primaryBlue;
                border-radius: 50%;
            }
        }

        .dropdown-options{
            position: absolute;
            top: 50px;
            right: 0px;
            background: #FFF;
            width: 200px;
            border: 1px solid transparent;
            opacity: 0;

            display: flex;
            flex-direction: column;
            gap: 20px;

            overflow: hidden;
            max-height: 0;
            z-index: 5;
            .soft-transition(@time: 0.35s);

            &.show{
                border: 1px solid @primaryGray;
                padding: 35px 35px 35px 0px;
                opacity: 1;
                max-height: fit-content;
            }

            &:after{
                content: '';
                right: 15px;
                top: 0px;
                position: absolute;
                border-right: transparent solid 7px;
                border-top: @primaryBlue solid 7px;
                border-left: transparent solid 7px;
            }
            
        }

    }

    @media only screen and (max-width: 768px) {
        .dropdown-wrapper .dropdown-toggle .iconify {
            color: @primaryYellow;
            border: 2px solid @primaryYellow;
        }

        .name{
            display: none;
        }
    }

    @media only screen and (max-width: 600px) {
        .dropdown-wrapper .dropdown-toggle .iconify {
            font-size: 28px;
        }
    }
    

</style>

<template>

    <button :color="color" :size="size" @click.prevent="userStore.signOut">
        <IconifyIcon icon="material-symbols:logout-rounded"/>
        
        <transition appear @enter="fadeIn">

            <span v-if="text != ''">
                {{text}}
            </span>

        </transition>

    </button>

</template>

<script setup>
    import gsap from 'gsap';
    import { useAuthStore } from "@/stores/user";
    const userStore = useAuthStore();

    defineProps({
        size: String,
        color: String,
        text: String,
    })

    const fadeIn = (el) => {
        gsap.fromTo(el, {
            opacity: 0,
        },
        {   
            opacity: 1,
            duration: 1.25,
        });
    }

</script>

<style scoped lang="less">

    button{
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;

        .iconify{
            color: v-bind(color);
            font-size: v-bind(size);
        }

    }

</style>
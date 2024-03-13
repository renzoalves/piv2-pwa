<template>


    <button class="geral-button" :class="customClass" v-if="buttonType != 'anchor' && buttonType != 'external'" :type="buttonType" :disabled="loading" >
    
        {{text}}

        <IconifyIcon v-if="loading" icon="line-md:loading-loop"/>
    
    </button>

    <a v-else-if="buttonType == 'external'" :class="customClass" class="geral-button link-button" target="_blank" :href="to">{{text}}</a>

    <router-link v-else :class="customClass" class="geral-button link-button" :to="to"> {{text}} </router-link>

</template>

<script setup>

    defineProps({

        buttonType: {
            default: 'button',
            type: String,
        },
        customClass: {
            default: '',
            type: String,
        },
        text: String,
        loading: {
            default: false,
            type: Boolean
        },
        to: {
            type: String,
            default: '',
        },

    })

</script>

<style scoped lang="less">

    .geral-button{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px 105px;
        border-radius: 10px;
        border: 3px solid @primaryYellow;
        box-sizing: border-box;
        color: #000;
        font-weight: 600;
        font-size: 20px;
        background: @primaryYellow;
        text-decoration: none;
        cursor: pointer;

        &.link-button{
            padding: 10px 75px;
        }

        .soft-transition();

        &:focus{
            box-shadow: inset 0px 5px 5px #00000029;
            border: 3px solid @darkYellow;
        }

        &:hover{
            background: @primaryYellowDarken;
            border: 3px solid @primaryYellowDarken;
        }

        &:disabled{
            opacity: 0.3;
            pointer-events: none;
            cursor: default;
            position: relative;

            .iconify{
                position: absolute;
                top: 50%;
                right: 5%;
                transform: translateY(-50%);
                font-size: 24px;
            }

        }

    }

</style>
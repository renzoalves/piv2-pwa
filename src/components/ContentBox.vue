<template>
    <div class="content-box">
        <div class="box-slot">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped lang='less'>

    .content-box{
        background: #FFF;
        padding: 50px 70px;
        border-radius: 5px;
        gap: 180px;
        height: auto;
        box-sizing: border-box;
        
        .box-slot{
            width: 100%;
        }

        :slotted(p), :slotted(label){
            font-size: 18px;
            color: @primaryGray;
            line-height: 22px;
            width: 75%;
        }

        :slotted(h2){
            font-size: 30px;
            color: @primaryBlue;
            margin-bottom: 15px;
        }
    }

    @media only screen and (max-width: 1480px){
        .content-box{
            padding: 30px;
        }
    }

    @media only screen and (max-width: 768){
        .content-box{
            padding: 15px;
        }
    }


</style>